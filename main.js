/**
 * Created by 邵敬超 on 2017/11/27.
 * @requires tmpl 模板引擎
 */

;(function (win, $) {
	
	/* 功能
	 *（基本功能）
	 * 1. 自定义文字大小
	 * 2. 改变文字颜色
	 * 3. 文字内容
	 * */
	var defaults = {
		color: '#fff',
		fontSize: '15px',
		time: '5',
		delay: 300,
		text: '这是一条弹幕。'
	};
	
	function getBullet () {
		return {
			fontSize: $('[name="f_size"]').val(),
			text: $('input[name="f_text"]').val(),
			color: $('[name="f_color"]:checked').val(),
			time: $('[name="f_time"]').val()
		}
	}
	
	/*单条弹幕处理*/
	function _itemFn (item) {
		var _item = $.extend({}, this._opts.config, item);
		var $item = $(tmpl(this._opts.itemTpl, [_item]));
		var _size = this._size;
		var _time = parseInt(_item.time);
		var _ran = Math.random() * _size.height * (1 / 3);
		this.$el.find('.J_bulList').append($item);
		$item.css({
			'top': _ran + 'px',
			'transform': 'translate(-' + (_size.width + $item.outerWidth()) + 'px)',
			'transition': 'transform ' + (_time + 's') + ' linear'
		});
		setTimeout(function () {
			$item.remove();
		}, _time * 1000);
	}
	
	/*添加弹幕*/
	function addBul (data) {
		var _this = this;
		var _delay = _this._opts.config.delay;
		if (data == null) {
			data = getBullet();
		}
		if ($.isArray(data)) {
			$.each(data, function (index, item) {
				
				/*多条数据延迟发送*/
				(function (t) {
					setTimeout(function () {
						_itemFn.call(_this, item)
					}, t)
				})(index * _delay)
			})
		} else {
			_itemFn.call(_this, data)
		}
	}
	
	/**
	 * opts 配置
	 * @item {String} 单条弹幕模板
	 * @color {String} 字体颜色
	 * @fontSize {Number} 文字大小
	 * @text {String} 文字内容
	 * */
	var Bullet = function ($el, data, opts) {
		this.$el = $el;
		this._opts = opts;
		this._default = defaults;
		this._opts.config = opts.config != null ? $.extend({}, defaults, opts.config) : defaults;
		this._size = {
			height: $el.innerHeight(),
			width: $el.innerWidth()
		};
		this.$el.append(tmpl(opts.tpl, []));
		addBul.call(this, data);
		return this
	};
	
	Bullet.prototype = {
		addBul: addBul,
		getBullet: getBullet
	};
	
	if (window.tmpl == null) {
		console.error('请先加载 blueimp-JavaScript-Templates 插件')
	}
	
	win.Bullet = Bullet;
})(window, jQuery);