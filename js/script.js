var splatoonApp = (function($) {

	var endpoint = 'https://dsp-an0thernoob.cloud.dreamfactory.com:443/rest/';
	var splatoonDBName = 'splatoon-users-db';
	var user_data = null;
	var squid_data = null;
	var $container = $('.splatoon-list');
	var $registerNNIDForm = $('#registerNNIDForm');
	var $registerForm = $('#registerForm');
	var $validateForm = $('#validateForm');
	var $loginForm = $('#loginForm');
	var headers = {
		'X-DreamFactory-Application-Name': 'splatoon'
	};
	var guestHeaders = {
		'X-DreamFactory-Application-Name': 'splatoon'
	};

	function init() {
		getSplatoonUsers(loadList);

		$loginForm.submit(function(event) {
			event.preventDefault();

			login(this);
		});

		$registerNNIDForm.submit(function(event) {
			event.preventDefault();

			registerSplatoonUser(this);
		});

		$registerForm.submit(function(event) {
			event.preventDefault();

			register(this);
		});

		$validateForm.submit(function(event) {
			event.preventDefault();

			validate(this);
		});

		$('.splatoon-logout').click(function() {
			logout();
		});

		$('.splatoon-register').click(function() {
			openForm(this);
			$(this).addClass('is-hide');
			hideForm('loginForm');
		});
	}

	function openForm(button) {
		if(typeof button == 'object') {
			var $form = $('#' + $(button).data('form'));
		} else if(typeof button == 'string') {
			var $form = $('#' + button);
		}

		$form.removeClass('is-hide');

		$(button).removeClass('is-show');
	}

	function hideForm(form) {
		if(typeof form == 'object') {
			var $form = form;
			
		} else if(typeof form == 'string') {
			var $form = $('#' + form);
		}

		$form.addClass('is-hide');
	}

	function register(form) {
		var $form = $(form);
		var url = endpoint + 'user/register';
		var formData = $form.serializeObject();

		deactivateForm($form);

		$.ajax({
			'url': url,
			'method': 'POST',
			'headers': headers,
			'data': JSON.stringify(formData)
		}).success(function(data) {
			openForm('validateForm');

			$validateForm.find('[name=email]').val(formData.email);

			hideForm($form);
		}).complete(function() {
			activateForm($form);
		});
	}

	function validate(form) {
		var $form = $(form);
		var url = endpoint + 'user/register';
		var formData = $form.serializeObject();

		deactivateForm($form);

		$.ajax({
			'url': url,
			'method': 'POST',
			'headers': headers,
			'data': JSON.stringify(formData)
		}).success(function(data) {
			var $record;
			
			user_data = data;
			headers['X-DreamFactory-Session-Token'] = data.session_id;

			hideForm($form);

			$('.splatoon-logout').addClass('is-show');

			get_squid();
			
			$registerNNIDForm.removeClass('is-hide');

			deactivateForm($validateForm);
		}).complete(function() {
			activateForm($validateForm);
		});
	}

	function login(form) {
		var $form = $(form);
		var url = endpoint + 'user/session';
		var data = $form.serializeObject();

		deactivateForm($form);

		$.ajax({
			'url': url,
			'method': 'POST',
			'headers': headers,
			'data': JSON.stringify(data)
		}).success(function(data) {
			var $record;
			
			user_data = data;
			headers['X-DreamFactory-Session-Token'] = data.session_id;

			hideForm($form);

			$('.splatoon-logout').addClass('is-show');

			get_squid();
			
			$registerNNIDForm.removeClass('is-hide');

			deactivateForm($registerNNIDForm);
		}).complete(function() {
			activateForm($form);
		});
	}

	function logout() {
		var url = endpoint + 'user/session';

		// $.ajax({
		// 	'url': url,
		// 	'method': 'delete',
		// 	'headers': headers,
		// }).success(function(data) {
			user_data = null;
			delete headers['X-DreamFactory-Session-Token'];

			$loginForm.removeClass('is-hide');
			$registerNNIDForm.addClass('is-hide');

			$('.splatoon-logout').removeClass('is-show');
		// });
	}

	function getSession() {
		var url = endpoint + 'user/session';
		var data = {
			'email': 'vladimirvodstock@gmail.com',
			'password': 'test123'
		};

		$.ajax({
			'url': url,
			'method': 'GET',
			'headers': headers,
		}).success(function(data) {
			console.log(data);
		});
	}

	function get_user() {
		return user_data;
	}

	function getSplatoonUsers(callback) {
		var url = endpoint + 'db/' + splatoonDBName;
		var formData = {
			'order': 'nnid ASC'
		};

		$.ajax({
			'url': url,
			'method': 'GET',
			'headers': guestHeaders,
			'data': JSON.stringify(formData)
		}).success(function(data) {
			callback(data);
		});
	}

	function get_squid() {
		var url = endpoint + 'db/' + splatoonDBName;
		var data = {
			'session_id': (user_data) ? user_data.session_id : null,
			'filter' : 'user = ' + user_data.id,
			'limit': 1
		};

		$.ajax({
			'url': url,
			'method': 'GET',
			'headers': headers,
			'data': JSON.stringify(data)
		}).success(function(data) {
			if(data.record.length > 0) {
				var $nnidInput = $registerNNIDForm.find('[name=nnid]');
				var $rankInput = $registerNNIDForm.find('[name=rank]')
				var $submitInput = $registerNNIDForm.find('[type=submit]');
				
				squid_data = data.record[0];

				$nnidInput.val(squid_data.nnid);
				$rankInput.val(squid_data.rank);
				$submitInput.text('Actualizar');
			}
		}).complete(function(data) {
			activateForm($registerNNIDForm);
		});
	}

	function registerSplatoonUser(form) {
		var $form = $(form);
		var url = endpoint + 'db/' + splatoonDBName;
		var formData = {
			'record': [
				$form.serializeObject()
			]
		};

		deactivateForm($form);

		formData.record[0].user = user_data.id;

		if(squid_data === null) {
			$.ajax({
				'url': url,
				'method': 'POST',
				'headers': headers,
				'data': JSON.stringify(formData)
			}).success(function(data) {
				getSplatoonUsers(loadList);
			}).complete(function() {
				activateForm($form);
			});
		} else {
			formData.ids = [squid_data.id];

			$.ajax({
				'url': url,
				'method': 'PUT',
				'headers': headers,
				'data': JSON.stringify(formData)
			}).success(function(data) {
				getSplatoonUsers(loadList);
			}).complete(function() {
				activateForm($form);
			});
		}

	}

	function loadList(data) {
		var users = data.record;

		$container.html('');
		
		$.each(users, function(index, user) {
			var source = $('#splatoon-user').html();
			var template = Handlebars.compile(source);
			var html = template(user);

			$container.append(html)
		});

		$('.splatoon-edit').click(function() {
			openForm(this);
		});
	}

	function deactivateForm($form) {
		$form.find('input, select, button').attr('disabled', true);
	}

	function activateForm($form) {
		$form.find('input, select, button').removeAttr('disabled');
	}

	$.fn.serializeObject = function() {
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};

	init();
})(jQuery);