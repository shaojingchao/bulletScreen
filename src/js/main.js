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
		delay:300,
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
		var _this = this;
		
		//获取空隙最大的那条弹幕
		function getMinNum (itemPos) {
			var arr1 = [];
			var arr2 = [];
			var _id;
			for (_id in itemPos){
				arr1.push(itemPos[_id].index);
				arr2.push(itemPos[_id].right);
			}
			
			console.log(itemPos[_id])
			var _min = Math.min.apply(null,arr2);
			console.log('_min_min_min_min_min_min_min_min',arr2.indexOf(_min))
			if (!(arr1[arr2.indexOf(_min)])){
				console.warn(arr1,arr2)
			}
			
			return arr1[arr2.indexOf(_min)]
		}
		
		/*获取空位索引值*/
		this.getIndex = function () {
			var filtered = [];
			
			// 计算空位
			var _this = this;
			$.each(this.box,function (i,item) {
				if (item === undefined){
					filtered.push(i)
				} else {
					var _item = $('[data-id=' + item + ']');
					var _rect = _item.get(0).getBoundingClientRect();
					// _this.itemPos[item] = {};
					_this.itemPos[item].right = parseInt(_rect.right);
				}
			});
			
			console.log(_this.itemPos)
			
			// console.log(_this.itemPos);
			
			var filteredLen = filtered.length;
			var _ranIndex = parseInt(filteredLen * Math.random());
			var _minMumId = getMinNum(_this.itemPos);
			console.log('_minMumId',_minMumId);
			
			//空位优先
			if (filteredLen > 0) {
				return filtered[_ranIndex]
			}
			//没有空位获取空间最大的位置
			else if (_minMumId) {
				return _minMumId
			} else {
				console.log('----------------false')
				return false;
			}
		};
		
		// 添加一条弹幕记录
		this.add = function (id) {
			var _index = this.getIndex();
			console.log('_index_index_index_index_index_index_index_index_index_index',_index)
			if (_index !== false) {
				this.itemPos[id] = {};
				this.itemPos[id].index = _index;
				this.box[_index] = id;
				return this.itemPos[id];
			}else{
				return false;
			}
		};
		
		// 弹幕消失删除记录
		this.del = function (id) {
			if(this.itemPos[id]){
				delete this.itemPos[id];
				this.box = this.box.map(function (value) {
					return value === id ? undefined : value
				});
			}
		};
		
	}
	
	
	
	/*单条弹幕处理*/
	function _itemFn (item) {
		var _this = this;
		 var _item = $.extend({},this._opts.config,item);
		 var $item = $(tmpl(this._opts.itemTpl, [_item]));
		var _ran = parseInt(Math.random() * this.maxLen);
		 var _size = this._size;
		 var _time = parseInt(_item.time);
		var _date = new Date().getTime();
		var _pos = _this.nextPos.add(_date);
		var _loopAdd;
		
		
		function _call (_pos) {
			console.log(_pos)
			_this.$el.find('.J_bulList').append($item);
			$item.attr('data-id',_date);
			$item.css({
				'top':  _pos.index * 45 + 'px',
				'transform': 'translate(-' + (_size.width + $item.outerWidth()) + 'px)',
				'transition': 'transform ' +( _time + 's') +' linear'
			});
			setTimeout(function () {
				$item.remove();
				_this.nextPos.del(_date);
			}, _time * 1000);
		}
		
		console.log(_pos);
		
		if (_pos === false) {
			_loopAdd = setInterval(function () {
				_pos = _this.nextPos.add(_date);
				if (_pos) {
					clearInterval(_loopAdd);
					_call(_pos);
				}
			},1000);
		} else {
			_call(_pos)
		}
		
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