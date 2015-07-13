/**
 * @TagBox  标签输入框
 * @Time	2015-7-9
 * @Compatible IE7+
 */
/** class tagbox **/
var TagBox = function(opt){
	this.obj = null; 
	this.list = null; 
	this.tags = []; 
	this.disclass = '';
	this.settings = {
		toChange : function(){}
	}
	opt && this.init(opt);
};
TagBox.prototype = {
	init : function(opt){
		if (!opt) { return false;}
		this.obj = getObj(opt.iptId);
		this.list = getObj(opt.listId);
		this.disclass = opt.disclass;
		this.tags = this.list.getElementsByTagName(opt.tagName);
		this.extend( this.settings , opt );
		this.run();
	},
	run : function(){
		var _this = this; 
		for(var i=0; i<this.tags.length; i++){
			this.tags[i].abled = true;
			this.tags[i].onclick = function(){
				if(this.abled){ // 插入
					_this.insertTag(this);
				} else { // 删除
					_this.removeTag(this);
				}
				_this.settings.toChange(_this.obj);
			};
		}
		// this.obj.addEventListener('input',function(){},false);

		this.obj.oninput = this.obj.onchange = this.obj.onpropertychange = function(){
			_this.checkTagHigh();
			_this.settings.toChange(this);
		}
		this.obj.onfocus = function(){
			var ipt = this; //输入框
			document.onkeydown = function(ev){
				var ev = ev || window.event;
				var curStart = getPositionForInput(ipt);
				var curEnd = getPositionForInputEnd(ipt);
				var str = ipt.value;
				if(ev.keyCode === 8){ //前删 backspace
					if(curStart == 0) return;
					if((str.charAt(str.length-1)!=',') && (str.length!=0)) { str += ',';}
					if(str.length>1 && curStart == curEnd){
						curStart--;
						// 校验tag
						if(!_this.checkTag(str,curStart)){ 
							_this.settings.toChange(_this.obj);
							return false;
						}
					} 
					// 删空输入框后，重置tag
					if(getPositionForInput(ipt) == 1 && ipt.value.length == 1){ _this.clearTagList();}
				} else if(ev.keyCode === 46){ //后删 del
					if(curStart == str.length) return;
					if((str.charAt(str.length-1)!=',') && (str.length!=0)) { str += ',';}
					if(str.length>1 && curStart == curEnd){
						// 校验tag
						if(!_this.checkTag(str,curStart)){ 
							_this.settings.toChange(_this.obj);
							return false;
						}
					}
					// 删空输入框后，重置tag
					if(getPositionForInput(ipt) == 0 && ipt.value.length == 1){ _this.clearTagList();}
				}
				
			};
		};
		this.obj.onblur = function(){
			document.onkeydown = null;
			var str = _this.obj.value;
			if((str.charAt(str.length-1)!=',') && (str.length!=0)) _this.obj.value = str + ',';
			_this.settings.toChange(_this.obj);
		};
	},
	extend: function(obj1,obj2) {
        for(var attr in obj2){ obj1[attr] = obj2[attr]; }
    },
	insertTag : function(tag){ // 插入标签
		var str = this.obj.value;
		if(str.charAt(str.length-1) != ',' && str.length != 0) str += ',';
		var add = tag.innerHTML.replace(/^\s*|\s*$/g, "") + ',';
		this.obj.value = str + add;
		tag.className = this.disclass;
		tag.abled = false;
	},
	removeTag : function(tag){ // 删除标签
		var str = this.obj.value;
		var tagName = tag.innerHTML.replace(/^\s*|\s*$/g, "")+',';
		var x = str.indexOf(tagName,0);
		var n = 0;
		var n1 = null;
		while(x!=-1){
			if(str.charAt(x-1)==',' || str.charAt(x-1)==''){
				this.obj.value = str.substring(0,x) + str.substring(x+tagName.length,str.length);
				tag.className = '';
				tag.abled = true;
				break;
			} else {
				x = str.indexOf(tagName,x+1);
			}
		}
	},
	cutStr : function(ipt,x1,x2){ // 键盘删除时剪切tag
		var str = ipt.value;
		return str.substring(0,x1) + str.substring(x2+1,str.length);
	},
	checkTag : function(str,curStart){ // 键盘删除时校验tag
		while(str.charAt(curStart)!=','){ 
			if(curStart == str.length){return;}
			curStart++;
		}
		var arr = str.substring(0,curStart).split(','); 
		var nowtag = arr[arr.length-1];
		for(var i=0; i<this.tags.length; i++){
			var tagText = this.tags[i].innerHTML.replace(/^\s*|\s*$/g, "");
			var tagclass = this.tags[i].className;
			

			if(nowtag == tagText){
				var n = this.tagNum(str,tagText);
				if(tagclass == this.disclass && n == 1){
					var x1 = curStart - tagText.length;
					this.obj.value = this.cutStr(this.obj,x1,curStart);
					setCursorPosition(this.obj,x1);
					this.tags[i].className = '';
					this.tags[i].abled = true;
					return false;
				}
				return true;
			}
		}
		return true;
	},
	clearTagList : function(){
		for( var i=0; i<this.tags.length; i++){
			this.tags[i].className = '';
			this.tags[i].abled = true;
		}
	},
	tagNum : function(str,tag){ // 查找str中tag出现的个数
		var arr = str.split(tag+',');
		var n = arr.length-1;
		for(var i=0; i<arr.length; i++){
			if(arr[i].charAt(arr[i].length-1) != ',' && arr[i] != ''){
				n--;
			}
		}
		return n;
	},
	checkTagHigh : function(){
		var str = this.obj.value;
		var tagHigh = [];
		for(var i=0; i<this.tags.length; i++){
			if(this.tags[i].className == this.disclass){
				tagHigh.push(this.tags[i]);
			}
		}
		for(var i=0; i<tagHigh.length; i++){
			var x = str.indexOf(tagHigh[i].innerHTML.replace(/^\s*|\s*$/g, "")+',');
			if(x == -1){
				tagHigh[i].className = '';
				tagHigh[i].abled = true;
			} else {
				var n = 0;
				while( x != -1){
					if(str.charAt(x-1)==',' || str.charAt(x-1)==''){
						n++;
						break;
					} else {
						x = str.indexOf(tagHigh[i].innerHTML.replace(/^\s*|\s*$/g, "")+',' , x+1);
					}
				}
				if(n === 0){
					tagHigh[i].className = '';
					tagHigh[i].abled = true;
				}
			}
		}

	}
};
/** common **/
function getObj(name){ 
	return 'string'==(typeof name) ? document.getElementById(name) : name;
}
function getPositionForInput(ctrl){ 
	var CaretPos = 0; 
	if (document.selection) { // IE Support 
		ctrl.focus(); 
		var Sel = document.selection.createRange(); 
		Sel.moveStart('character', -ctrl.value.length); 
		CaretPos = Sel.text.length; 
	}else if(ctrl.selectionStart || ctrl.selectionStart == '0'){
		CaretPos = ctrl.selectionStart; 
	} 
	return (CaretPos); 
}
function getPositionForInputEnd(ctrl){ 
	var CaretPos = 0; 
	if (document.selection) { // IE Support 
		ctrl.focus();
		var range = null;
		range = document.selection.createRange();
		var stored_range = range.duplicate();
		stored_range.moveToElementText( ctrl );
		stored_range.setEndPoint('EndToEnd', range );
		ctrl.selectionStart = stored_range.text.length - range.text.length;
		ctrl.selectionEnd = stored_range.text.length;
		CaretPos = ctrl.selectionEnd;

	}else if(ctrl.selectionEnd || ctrl.selectionEnd == '0'){
		CaretPos = ctrl.selectionEnd; 
	} 
	return (CaretPos); 
}
function setCursorPosition(ctrl, pos){ 
	if(ctrl.setSelectionRange){ 
		ctrl.focus(); 
		ctrl.setSelectionRange(pos,pos); 
	} 
	else if (ctrl.createTextRange) { 
		var range = ctrl.createTextRange(); 
		range.collapse(true); 
		range.moveEnd('character', pos); 
		range.moveStart('character', pos); 
		range.select(); 
	} 
} 