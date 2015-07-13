# Tag-Input

### 文本域添加删除tag插件：

* 点击tag按钮插入到文本域中用`，`分隔；

* 在文本域中有效tag(有效tag：下方tag按钮列表中置灰的tag)上点击`Backspace`或`Delete`，可以直接删除整个tag；

* 再次点击置灰tag按钮可以删除文本域中第一个有效tag，按钮自身恢复，且如果还存在其他有效tag判定为失效(因为下方按钮非置灰了)
；
* 手动编辑文本域中的有效tag后，下方相应置灰的tag按钮恢复(即该tag失效)；

* 文本域的高度随输入文字的多少动态改变；

=======
### 引用方法：
```js
var t = new TagBox({ 
	iptId : 'tag-ipt',  // 文本域id
	listId: 'tag-list', // 标签ul的id
	tagName: 'li',	// tag标签名
	disclass:'dis', // 置灰的class名
	toChange : function(obj){} // 预留接口，文本域内容改变时触发
});
```
=======


