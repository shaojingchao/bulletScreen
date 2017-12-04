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
		fontSize: '30px',
		time: '5',
		delay:400,
		text: '这是一条弹幕。'
	};
	
	function getBullet() {
		return {
			fontSize: $('[name="f_size"]').val(),
			text: $('input[name="f_text"]').val(),
			color: $('[name="f_color"]:checked').val(),
			time: $('[name="f_time"]').val()
		}
	}
	
	/*防重叠*/
	function _NextPos (len) {
		this.itemPos = {};
		this.box = new Array(len);
		
		/*获取空位索引值*/
		this.getIndex = function () {
			var filtered = [];
			$.each(this.box,function (i,item) {
				if (item === undefined){
					filtered.push(i)
				} else {
					var _item = $('[data-id=' + item + ']');
					console.log(_item.get(0).getBoundingClientRect())
					var offset = _item.offset();
					var itemOffset = {
						top:parseInt(offset.top),
						left:parseInt(offset.left),
						width:_item.width(),
						height:_item.height()
					}
					console.log('itemOffset',itemOffset)
				}
			})
			console.log(filtered)
			return (filtered.length > 0) ? filtered[0] : false;
		}
		
		// 添加一条弹幕记录
		this.add = function (id,pos) {
			pos.index = this.getIndex()
			if (pos.index !== false) {
				this.itemPos[id] = pos;
				this.box[pos.index] = id;
				console.log('添加成功');
				return pos;
			}else{
				return false;
			}
		}
		
		// 弹幕消失删除记录
		this.del = function (id) {
			if(this.itemPos[id]){
				delete this.itemPos[id];
				this.box = this.box.map(function (value) {
					return value === id ? undefined : value
				})
				console.log(id + ': 已移除')
			}
		}
		
		// this.getPos = function () {
		// 	var filtered = [];
		// 	$.each(this.box,function (i,item) {
		// 		if (item === undefined){
		// 			filtered.push(i)
		// 		}
		// 	})
		// 	if(filtered.length){
		// 		return filtered[0];
		// 	}else{
		//
		// 	}
		//
		// }
		
	}
	
	
	
	/*单条弹幕处理*/
	function _itemFn (item) {
		var _this = this;
		 var _item = $.extend({},this._opts.config,item);
		 var $item = $(tmpl(this._opts.itemTpl, [_item]));
		var _ran = parseInt(Math.random() * this.maxLen);
		 var _size = this._size;
		 var _time = parseInt(_item.time);
		this.$el.find('.J_bulList').append($item);
		var _date = new Date().getTime();
		var _pos = _this.nextPos.add(_date,{
			w: $item.width(),
			h:$item.height()
		})
		$item.attr('data-id',_date)
		
		console.log('_pos',_pos);
		
		 
		
		$item.css({
			'top':  (_pos ? _pos.index : _ran) * 45 + 'px',
			'transform': 'translate(-' + (_size.width + $item.outerWidth()) + 'px)',
			'transition': 'transform ' +( _time + 's') +' linear'
		});
		setTimeout(function () {
			$item.remove();
			_this.nextPos.del(_date);
		}, _time * 1000);
	}
	
	/*添加弹幕*/
	 function addBul (data) {
		var _this = this;
		var _delay = _this._opts.config.delay;
		if (data == null) {
			data = getBullet();
		}
		if($.isArray(data)) {
			$.each(data,function (index,item) {
				
				/*多条数据延迟发送*/
				(function (t) {
					setTimeout(function () {
						_itemFn.call(_this,item)
					},t)
				})(index * _delay)
			})
		}else{
			_itemFn.call(_this,data)
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
		this.maxLen = parseInt(this._size.height * 0.7 / 45);
		this.nextPos = new _NextPos(this.maxLen);
		console.log('nextPos',this.nextPos);
		
		// this.$el.append(tmpl(opts.tpl, []));
		addBul.call(this,data);
		return this
	};
	
	
	Bullet.fn = Bullet.prototype;
	
	Bullet.prototype = {
		addBul: addBul,
		getBullet: getBullet
	};

	if(window.tmpl == null){
		console.error('请先加载 blueimp-JavaScript-Templates 插件')
	}
	
	win.Bullet = Bullet;
})(window, jQuery);