//****************针对第二种方式的具体js实现部分******************//
//****************所使用的数据是city.js******************//


var addrShow02 = $('addr-show02');  //最终地址显示框
var titleWrap = $('title-wrap').getElementsByTagName('LI');
var addrWrap = $('addr-wrap');   //省市区显示模块
var btn2 = document.getElementsByClassName('met2')[0];  //确定按钮

var current2 = {
    prov: '',
    city: '',
    country: '',
    provVal: '',
    cityVal: '',
    countryVal: ''
};

/*自动加载省份列表*/
window.onload = showProv2();

function showProv2() {
    addrWrap.innerHTML = '';
    /*addrShow02.value = '';*/
    btn2.disabled = true;
    titleWrap[0].className = 'titleSel';
    var len = provice.length;
    for (var i = 0; i < len; i++) {
        var provLi = document.createElement('li');
        provLi.innerText = provice[i]['name'];
        provLi.index = i;
        addrWrap.appendChild(provLi);
    }
}

/*************************需要给动态生成的li绑定点击事件********************** */
addrWrap.onclick = function (e) {
    var n;
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if (target && target.nodeName == 'LI') {
        /*先判断当前显示区域显示的是省市区的那部分*/
        for (var z = 0; z < 3; z++) {
            if (titleWrap[z].className == 'titleSel')
                n = z;
        }
        /*显示的处理函数*/
        switch (n) {
            case 0:
                showCity2(target.index);
                break;
            case 1:
                showCountry2(target.index);
                break;
            case 2:
                selectCountry(target.index);
                break;
            default:
                showProv2();
        }
    }
};

/*选择省份之后显示该省下所有城市*/
function showCity2(index) {
    addrWrap.innerHTML = '';
    current2.prov = index;
    current2.provVal = provice[index].name;
    titleWrap[0].className = '';
    titleWrap[1].className = 'titleSel';
    var cityLen = provice[index].city.length;
    for (var j = 0; j < cityLen; j++) {
        var cityLi = document.createElement('li');
        cityLi.innerText = provice[index].city[j].name;
        cityLi.index = j;
        addrWrap.appendChild(cityLi);
    }
}

/*选择城市之后显示该城市下所有县区*/
function showCountry2(index) {
    addrWrap.innerHTML = '';
    current2.city = index;
    current2.cityVal = provice[current2.prov].city[index].name;
    titleWrap[1].className = '';
    titleWrap[2].className = 'titleSel';
    var countryLen = provice[current2.prov].city[index].districtAndCounty.length;
    if (countryLen == 0) {
        addrShow02.value = current2.provVal + '-' + current2.cityVal;
    }
    for (var k = 0; k < countryLen; k++) {
        var cityLi = document.createElement('li');
        cityLi.innerText = provice[current2.prov].city[index].districtAndCounty[k];
        cityLi.index = k;
        addrWrap.appendChild(cityLi);
    }
}

/*选中具体的县区*/
function selectCountry(index) {
    btn2.disabled = false;
    current2.country = index;
    addrWrap.getElementsByTagName('li')[index].style.backgroundColor = '#23B7E5';
    current2.countryVal = provice[current2.prov].city[current2.city].districtAndCounty[index];
}

/*点击确定后恢复成初始状态，且将所选地点显示在输入框中。发送数据下载请求指令，显示右侧的数据下载界面。*/
btn2.onclick = function () {
    addrShow02.value = current2.provVal + ' ' + current2.cityVal + ' ' + current2.countryVal;
    addrWrap.getElementsByTagName('li')[current2.country].style.backgroundColor = '';

    if(document.getElementById("ShowData").style.display == "none")
      document.getElementById("ShowData").style.display = "";
    else
      document.getElementById("ShowData").style.display = "none"; 
    // viewer.camera.flyTo();
    jQuery.ajax({
        url:'http://www.cheosgrid.org.cn:8999/dis/dataQuery',
        type:"POST",
        data:JSON.stringify({pageNum:1,showNum:20,}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data,status){
            // console.log("数据: \n" + data + "\n状态: " + status);
            // console.log(data.businessDataObject.metaDataList[0].browseImage);
            // console.log(data);
            // 使用读取到的data数据，创建一个新的Json用于进行table的渲染
            // var data = {
            //     id : "GF6_WFV_1119943349_LEVEL1A",
            //     browseImage : "https://fastdfs.cheosgrid.org.cn/group1/M00/F3/56/wKgUD13Nll2AWZh-AAsaATj-X6U874.jpg",
            //     centerTime : "2019-11-14 23:00:42",
            //     dataSource : "GF",
            //     cloudPrecent : "19.0",
            //     lon : "-67.198095",
            //     lat : "-26.671943"
            // }
            // // var content = JSON.stringify(data);
            // // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            // // saveAs(blob, "data.json");
            // var fs = require('fs');
            // fs.readFile("TestData.json");
            // var person = data.toString();
            //

            layui.use('table', function(){
                var table = layui.table;
                //return;
                //渲染
                window.ins1 = table.render({
                    elem: '#test'
                    ,height: 400
                    ,width: 600
                    ,title: '用户数据表'
                    ,url: "Data.json"
                    //,size: 'lg'
                    ,page: {
                    }

                    ,autoSort: false
                    //,loading: false
                    ,totalRow: true
                    ,limit: 30
                    ,toolbar: '#toolbarDemo'
                    ,defaultToolbar: ['filter', 'exports', 'print', {
                        title: '帮助'
                        ,layEvent: 'LAYTABLE_TIPS'
                        ,icon: 'layui-icon-tips'
                    }]
                    ,cols: [[
                        {type: 'checkbox', fixed: 'left'}
                        ,{field:'id', title:'ID', width:100, sort: true, totalRow: true}
                        ,{field:'browseImage', title:'Image', width:100, sort: true, totalRow: true}
                        ,{field:'centerTime', title:'时间', width:100, sort: true, totalRow: true}
                        ,{field:'dataSource', title:'卫星', width:100, sort: true, totalRow: true}
                        ,{field:'cloudPrecent', title:'云量', width:100, sort: true, totalRow: true}
                        ,{field:'lon', title:'lon', width:100, sort: true, totalRow: true}
                        ,{field:'lat', title:'lat', width:100, sort: true, totalRow: true}

                        // ,{field:'id', title:'ID', width:80, fixed: 'left', unresize: true, sort: true, totalRowText: '合计：'}
                        // ,{field:'browseImage', title:'Image', width:120, edit: 'text', templet: '#usernameTpl'}
                        // ,{field:'email', title:'邮箱', hide: 0, width:150, edit: 'text', templet: function(d){
                        //         return '<em>'+ d.email +'</em>'
                        //     }}
                        // ,{field:'sex', title:'性别', width:80, edit: 'text', sort: true}
                        // ,{field:'city', title:'城市', width:120, templet: '#cityTpl1'}
                        // ,{field:'sign', title:'签名'}
                        // ,{field:'experience', title:'积分', width:80, sort: true, totalRow: true, templet: '<div>{{ d.experience }} 分</div>'}
                        // ,{field:'ip', title:'IP', width:120}
                        // ,{field:'logins', title:'登入次数', width:100, sort: true, totalRow: true}
                        // ,{field:'joinTime', title:'加入时间', width:120}
                        // ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:150}
                    ]]
                });
                //工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch(obj.event){
                        case 'add':
                            layer.msg('添加');
                            break;
                        case 'update':
                            layer.msg('编辑');
                            break;
                        case 'delete':
                            layer.msg('删除');
                            break;
                        case 'getCheckData':
                            var data = checkStatus.data;
                            layer.alert(JSON.stringify(data));
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：'+ data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选': '未全选')
                            break;
                        case 'LAYTABLE_TIPS':
                            layer.alert('Table for layui-v'+ layui.v);
                            break;
                        case 'reload':
                            table.reload('test', {
                                page: {curr: 5}
                                //,height: 300
                                //,url: 'x'
                            }, 'data');
                            break;
                    };
                });

                table.on('row(test)', function(obj){
                    console.log(obj);
                    //layer.closeAll('tips');
                });

                //监听表格行点击
                table.on('tr', function(obj){
                    console.log(obj)
                });

                //监听表格复选框选择
                table.on('checkbox(test)', function(obj){
                    console.log(obj)
                });

                //监听表格单选框选择
                table.on('radio(test)', function(obj){
                    console.log(obj)
                });

                //监听表格单选框选择
                table.on('rowDouble(test)', function(obj){
                    console.log(obj);
                });

                //监听单元格编辑
                table.on('edit(test)', function(obj){
                    var value = obj.value //得到修改后的值
                        ,data = obj.data //得到所在行所有键值
                        ,field = obj.field; //得到字段

                    console.log(obj)
                });

                //监听行工具事件
                table.on('tool(test)', function(obj){
                    var data = obj.data;
                    //console.log(obj)
                    if(obj.event === 'del'){
                        layer.confirm('真的删除行么', function(index){
                            obj.del();
                            layer.close(index);
                        });
                    } else if(obj.event === 'edit'){
                        layer.prompt({
                            formType: 2
                            ,value: data.email
                        }, function(value, index){
                            obj.update({
                                email: value
                            });
                            layer.close(index);
                        });
                    }
                });

                //监听排序
                table.on('sort(test)', function(obj){
                    console.log(this)

                    //return;
                    layer.msg('服务端排序。order by '+ obj.field + ' ' + obj.type);
                    //服务端排序
                    table.reload('test', {
                        initSort: obj
                        //,page: {curr: 1} //重新从第一页开始
                        ,where: { //重新请求服务端
                            key: obj.field //排序字段
                            ,order: obj.type //排序方式
                        }
                    });
                });

                var $ = layui.jquery, active = {
                    parseTable: function(){
                        table.init('parse-table-demo', {
                            limit: 3
                        });
                    }
                    ,add: function(){
                        table.addRow('test')
                    }
                };
                $('i').on('click', function(){
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
                $('.layui-btn').on('click', function(){
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            });






















        },
    })

};

/*分别点击省市区标题的处理函数*/
document.getElementById('title-wrap').onclick = function (e) {
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if (target && target.nodeName == 'LI') {
        for (var z = 0; z < 3; z++) {
            titleWrap[z].className = '';
        }
        target.className = 'titleSel';
        if (target.value == '0') {
            showProv2();
        } else if (target.value == '1') {
            showCity2(current2.prov);
        } else {
            showCountry2(current2.city);
        }
    }
};