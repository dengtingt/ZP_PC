var baseURL = "http://203.195.246.58:7777";
// 关闭模态框
function closeApplyModal(){
	$("#applyModal").modal("hide");
}

// 初始化招聘信息
function initData(){
	var url = baseURL+"/Employment/findAll"
	$.get(url,function(response){
		$(".employment").empty();
		response.data.forEach(function(item){
			var newDiv = $(`
				<div class="info row mx-0 px-0">
					<input type="hidden" value="`+item.id+`" />
					<div class="left col-5 pl-0">
						<p>`+item.title+`</p>
						<p>`+item.salary+`</p>
						<div class="span">
							<span>`+item.welfare+`</span>
							<span class="eat">包吃</span>
							<span class="live">包住</span>
						</div>
					</div>
					<div class="center col-4">
						<ul>
							<li>
								<p>工作时间：`+item.workingHours+`</p>
								<p>招聘人数：`+item.num+`</p>
							</li>
							<li>
								<p>工作类型：`+item.job+`</p>
								<p>工作地点：`+item.province+item.city+`</p>
							</li>
						</ul>
					</div>
					<div class="right col-3 text-center">
						<div class="apply btn-primary">报名参加</div>
					</div>
				</div>
			`);
			$(".employment").append(newDiv);
		})
	})
}

// 查询所有职位类型，放入职位栏目
function jobType(){
	var url = baseURL+"/JobType/findAll"
	var promise = new Promise(function(resolve,reject){
		$.get(url,function(response){
			if(response.data){
				response.data.map(function(item){
					var newDiv = $(`
						<ul class="jobType`+item.id+`">
							<input type="hidden" name="jobTypeId" value="`+item.id+`"/>
							<span>`+item.name+`</span>
						</ul>
					`);
					$("#alljob").append(newDiv);
					resolve(response.data);
				})
			}else{
				reject("请求数据为空!");
			}
		})
	})
	.then(function(jobType_data){
		var url = baseURL+"/Jobs/findAll"
		$.get(url,function(res){
			res.data.map(function(item){
				for(var key in jobType_data) {
              	  	if(jobType_data[key].id === item.jobTypeId) {
                  	  	var newLi = $(`
							<li>`+item.name+`</li>
						`);
						$(`#alljob .jobType`+jobType_data[key].id).append(newLi);
					
              	  	}
              	}
			})
		})
	})
	.catch(function(error){
		return error;
	})
}

// 查询所有省份，放入地点栏目
function Province(){
	var url = baseURL+"/Province/findAll"
	var promise = new Promise(function(resolve,reject){
		$.get(url,function(response){
			if(response.data){
				response.data.map(function(item){
					var newDiv = $(`
						<ul class="province`+item.id+`">
							<input type="hidden" name="provinceId" value="`+item.id+`"/>
							<span>`+item.name+`</span>
						</ul>
					`);
					$("#allcity").append(newDiv);
					resolve(response.data);
				})
			}else{
				reject("请求数据为空!");
			}
		})
	})
	// 根据省份id查询城市
	.then(function(province_data){
		for(var key in province_data){
			var url = baseURL+"/City/findByProvinceId"
			var provinceId = province_data[key].id;
			var data = {
				provinceId:provinceId
			}
			$.get(url,data,function(res){
				res.data.map(function(item){
					for(var key in province_data) {
                  	  	if(province_data[key].id === item.provinceId) {
	                  	  	var newLi = $(`
								<li>`+item.name+`</li>
							`);
							$(`#allcity .province`+province_data[key].id).append(newLi);
						
                  	  	}
                  	}
				})
			})
		}
	})
	.catch(function(error){
		return error;
	})
}

// 查询所有福利，放入福利栏目
function Welfare(){
	url = baseURL+"/Welfare/findAll"
	$.get(url,function(response){
		$.uniqueSort(response.data).forEach(function(item){
			var newDiv = $(`
				<ul>
					<span>`+item.name+`</span>
				</ul>
			`);
			$("#allwelfare").append(newDiv);
		})
	})
}

// =========================文档加载完成后执行
$(function(){
	initData();
	jobType();
	Province();
	Welfare();

	// 为确认报名按钮绑定事件处理函数
	$("#applyModal #save").click(function(){
		// 1. 获取参数
		var id = $("#jobhunter_form input[name=id]").val();
		var employmentId = $("#input_employmentId").val();
		var realname = $("#input_realname").val();
		var telephone = $("#input_telephone").val();
		var gender = $("#input_gender").val();
		var birth = $("#input_birth").val();
		var education = $("#input_education").val();
		var workTime = $("#input_workTime").val();
		var currentStatus = $("#input_currentStatus").val();
		var resume = $("#input_resume").val();

		// 2. 与后台进行交互	
		var url = baseURL+"/Jobhunter/quickRegistration";
		var data;
		if (id) {
			data = {
				id:id,
				employmentId:employmentId,
				realname:realname,
				telephone:telephone,
				gender:gender,
				birth:birth,
				education:education,
				workTime:workTime,
				currentStatus:currentStatus,
				resume:resume
			}
		} else{
			data = {
				employmentId:employmentId,
				realname:realname,
				telephone:telephone,
				gender:gender,
				birth:birth,
				education:education,
				workTime:workTime,
				currentStatus:currentStatus,
				resume:resume
			}
		}
		$.post(url,data,function(result){
			if(result.status === 200){
				closeApplyModal();
				alert(result.message);
			} else {
				alert(result.message);
			}
		});
		$('#applyModal').modal('hide');
	})

	// 为搜职位按钮绑定事件处理函数
	$("#sousuo").click(function(){
		// 将当前点击的option的值赋值给id
		var job = $(this).parents(".search").find("input").val();
		var url = '/Employment/findByJob';
		var data = {
			job:job
		};
		$.get(baseURL+url,data,function(response){
			$(".employment").empty();
			response.data.forEach(function(item){
				var newDiv = $(`
					<div class="info row mx-0 px-0">
						<div class="left col-5 pl-0">
							<p>`+item.title+`</p>
							<p>`+item.salary+`</p>
							<div class="span">
								<span>`+item.welfare+`</span>
								<span class="eat">包吃</span>
								<span class="live">包住</span>
							</div>
						</div>
						<div class="center col-4">
							<ul>
								<li>
									<p>工作时间：`+item.workingHours+`</p>
									<p>招聘人数：`+item.num+`</p>
								</li>
								<li>
									<p>工作类型：`+item.job+`</p>
									<p>工作地点：`+item.province+item.city+`</p>
								</li>
							</ul>
						</div>
						<div class="right col-3 text-center">
							<div class="apply btn-primary">报名参加</div>
						</div>
					</div>
				`);
				$(".employment").append(newDiv);
			})			
		});
	})



	// 为报名参加按钮绑定事件处理函数
	$(".employment").on("click","div.apply",function(){
		$('#applyModal').modal("show");
		$("#apply_form input[name=id]").val('');
		var employmentId = $(this).parents(".info").find('input').val();
		$("#applyModal #input_employmentId").val(employmentId);
	});
	// 监听模态框的关闭
	$('#applyModal').on('hidden.bs.modal',function(e){
		$(this).find("form")[0].reset();
	});

	// 根据省份id查询城市
	$("#allcity").on("mouseover","ul",function(){	
		$(this).find("li").addClass("current");
	})
	$("#allcity").on("mouseout","ul",function(){
		$("#allcity ul li").removeClass("current");
	})

	// 根据职位类型查询城市
	$("#alljob").on("mouseover","ul",function(){	
		$(this).find("li").addClass("current");
	})
	$("#alljob").on("mouseout","ul",function(){
		$("#alljob ul li").removeClass("current");
	})
})