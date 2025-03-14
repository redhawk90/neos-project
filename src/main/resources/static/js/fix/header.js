$kakaoBtn = $("button.joinKakao");
$naverBtn = $("button.joinNaver");
$googleBtn = $("button.joinGoogle")


$kakaoBtn.on("click",function () {
    location.href= "https://kauth.kakao.com/oauth/authorize?client_id=e29231bc42552a6803c663f6ba7bad63&redirect_uri=http://localhost:10718/join/kakao&response_type=code";
})
$naverBtn.on("click",function () {
    location.href= "https://nid.naver.com/oauth2.0/authorize?client_id=mCOGR2PgjWmMz5WHuVwE&response_type=code&redirect_uri=http://localhost:10718/join/naver/navercallback";
})
$googleBtn.on("click",function () {
    location.href="https://accounts.google.com/o/oauth2/v2/auth?client_id=514426667105-1lnfsvd1qiivml6ajencglio5lpvct8d.apps.googleusercontent.com&redirect_uri=http://localhost:10718/join/google&response_type=code&scope=email%20profile%20openid&access_type=offline&prompt=consent"
})



$KaKaoLoginBtn = $("button.loginKakao");
$NaverLoginBtn = $("button.loginNaver");
$GoogleLoginBtn = $("button.loginGoogle");
$KaKaoLoginBtn.on("click",function () {
    location.href= "https://kauth.kakao.com/oauth/authorize?client_id=e29231bc42552a6803c663f6ba7bad63&redirect_uri=http://localhost:10718/login/kakao&response_type=code";
})
$NaverLoginBtn.on("click",function () {
    location.href= "https://nid.naver.com/oauth2.0/authorize?client_id=mCOGR2PgjWmMz5WHuVwE&response_type=code&redirect_uri=http://localhost:10718/login/naver/navercallback";
})

$GoogleLoginBtn.on("click",function () {
    location.href="https://accounts.google.com/o/oauth2/v2/auth?client_id=514426667105-1lnfsvd1qiivml6ajencglio5lpvct8d.apps.googleusercontent.com&redirect_uri=http://localhost:10718/login/google&response_type=code&scope=email%20profile%20openid&access_type=offline&prompt=consent"
})



let collegeCheckHeader = false;
var userIdasdfasdfa = document.querySelector("#userId").value;
headerShow();
function headerShow(){
    $.ajax({
        url: "/user/"+userIdasdfasdfa,
        type: "get",
        success: getInfo,
        error: function(xhr, status, err){
           alert("d")
        }
    })
}

function getInfo(result){
    var userName = result.userNickName;
    var userPoint = result.userNeosPoint;
    var userNeosBadge = result.userNeosBadge;
    var userProfile = result.userFile;
    var userCollegeName = result.collegeName;
    var userOauthId = result.userOAuthId;

    const $nameTag = $("#userName");
    const $pointTag = $("#neosPoint");
    const $userNeosBadge = $("#userLevel");
    const $userProfileImg = $("#userProfileImg");
    const $userCollege = $("#userCollege");
    const $userOauthId = $("#userOauthId")

    $nameTag.text(userName);
    $pointTag.text(userPoint);
    $userNeosBadge.attr("src",userNeosBadge)
    $userProfileImg.attr("src",userProfile);
    $userProfileImg.attr("loading","LAZY");
    $userOauthId.val(userOauthId);
    if(userCollegeName==null){
        $userCollege.text("학생")
        collegeCheckHeader=true;
    }else{
        $userCollege.text(userCollegeName)

    }

}

$(".profile").on("click",function () {
    headerAlarmShow();
    if(!collegeCheckHeader){
        myStudyList();
    }
})


function headerAlarmShow(){
    $.ajax({
        url:"/alarm/header",
        type:"get",
        success: headerAlarmShowList
    })
}

function headerAlarmShowList(result){
    let total = result.length;
    if(total>0){
    let need = result[0];
    let time = need.createdTime;
    let createdTime = time.split('T')[0];

    let text= '';

        text += `<li class="alarmContent"><input type="hidden" id="alarmId" value="`+need.alarmId+`"><a class="popClick" onclick="read(this)">`
        text += `<p>`+need.alarmContent+`</p><span class="dateInfo">`+createdTime
        text += `</span><span class="newTag"></span>`
        text += `</a></li>`
    $(".alarmText").html(text);

    $(".alarmTotalCount").html(total);
    $(".moreAlarm em").html(total-1);
    }else{
        $(".alarmTotalCount").html(total);
        // $(".alarmText").html(text);
        $(".moreAlarm p").html("최신 알림이 없습니다.");
    }

}

function read(obj){
    var id = $(obj).prev().val();
    $.ajax({
        url:"/alarm/"+id,
        type:"post",
        success:function (result) {
            if(result=='no'){
             window.location.reload();
            }else{
                location.href=result;
            }
        }
    })

}

function myStudyList() {
    var userId = $("#userId").val();
    $.ajax({
        url:"/alarm/"+userId,
        type:"put",
        success:showStudyListHeader
    })
}

function showStudyListHeader(result) {
    let text= '';
    let total = result.length;
    if(total == 0){
        text += `<li class="alarmContent">`
        text += `<p></p><span class="dateInfo">`
        text += `</span><span style="font-size: .75rem; color: #42495b; margin: 6px 0" class="newTag">현재 진행중인 스터디가 없습니다.</span>`
        text += `</li>`
    }else if(total>=0 && total<=3){
        for(var i = 0 ; i < (total%4) ; i ++ ){
            text += `<li class="alarmContent"><a class="popClick" href="/study/list/`+result[i].studyId+`">`
            text += `<p>`+result[i].studyTitle+`</p><span class="dateInfo">`+result[i].studyStartDate
            text += `일에 개설</span><span class="newTag"></span>`
            text += `</a></li>`
        }
    }else{
        for(var i = 0 ; i < 3 ; i ++ ){
            text += `<li class="alarmContent"><a class="popClick" href="/study/list/`+result[i].studyId+`">`
            text += `<p>`+result[i].studyTitle+`</p><span class="dateInfo">`+result[i].studyStartDate
            text += `일에 개설</span><span class="newTag"></span>`
            text += `</a></li>`
        }
    }




    // $(result).each((i,item)=>{
    //     console.log(item);
    //     text += `<li class="alarmContent"><a class="popClick" href="/study/list/`+item.studyId+`">`
    //     text += `<p>`+item.studyTitle+`</p><span class="dateInfo">`+item.studyStartDate
    //     text += `일에 개설</span><span class="newTag"></span>`
    //     text += `</a></li>`
    // })

    $(".myStudyListShow").html(text);
    $(".myStudyListTotal").text(result.length);


}

