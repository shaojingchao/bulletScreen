/**
 * Created by 邵敬超 on 2017/11/27.
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
		fontSize: 14,
		time:5,
		text: '这是一条弹幕。'
	};
	
	// template.defaults();
	// var tmpl = template;
	
	
	
	/**
	 * opts 配置
	 * @item {String} 单条弹幕模板
	 * @color {String} 字体颜色
	 * @fontSize {Number} 文字大小
	 * @text {String} 文字内容
	 * */
	var Bullet = function ($el, data, opts) {
		this.$el = $el;
		this.opts = opts;
		opts.config = opts.config != null ? $.extend({}, defaults,opts.config) : defaults;
		
		this.size = function () {
			return {
				height: $el.innerHeight(),
				width: $el.innerWidth()
			}
		};
		var _this = this;
		var _data = [];
		for (var i = 0; i< data.length;i++) {
			_data[i] = $.extend({}, opts.config, data[i])
		}
		console.log(_data);
		// $el.html();
		
		console.log(this.$el)
		this.$el.append(tmpl(opts.tpl,[]));
		$(_data).each(function () {
			_this.addItem(this,this.time);
		});
		return _this
	};
	
	Bullet.fn = Bullet.prototype;
	Bullet.fn.renderItem = function (item) {
		var _opts = this.opts;
		var _item = $.extend({}, item, _opts.config);
		return tmpl(_opts.itemTpl, [_item])
	};
	
	Bullet.fn.addItem = function (item, time) {
		console.log(this.opts.config)
		var $item = $(this.renderItem($.extend(this.opts.config,item)));
		var _size = this.size();
		var _ran = Math.random() * _size.height * (1 / 3);
		console.log(time);
		this.$el.find('.J_bulList').append($item);
		$item.css({
			'top': _ran + 'px',
			'transform': 'translate(-' + (_size.width + $item.outerWidth()) + 'px)',
			'transition': 'transform ' + time + 's linear'
		});
		var aa = setTimeout(function () {
			// $item.remove();
			
		}, time*1000);
	};
	
	win.Bullet = Bullet;
})(window, jQuery);