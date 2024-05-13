(function($) {
    "use strict";


    	// Email Validation
	$.fn.conformyEmailValidate     = function () {
		var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegexp.test(String($(this).val()));
	}
	// Phone Validation
	$.fn.conformyPhoneValidate     = function () {
		//var phoneRegexp = /^[0-9]+$/;
		var phoneRegexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
			return phoneRegexp.test($(this).val());
	}
	$.fn.modalClose = function(){
		let thisModalTarget  = $(this).attr('id'),
			$this            = $(this);
		 
		$(window).on('click', function(event){
			if(event.target.id == thisModalTarget){
				$this.removeClass("active");
			}
		});
	}    

    //  Validate Input Variables
    var contactEmail    = $("input[name=contact_email]");
    var contactPhone    = $("input[name=contact_phone]");
    var formControl     = $('.cf-form-control');

    // Email Validation
    contactEmail.on("keyup", function() {
        if ( ( $(this).val().trim().length ) > 0) {
            if (! ($(this).conformyEmailValidate() === true) ) {
                contactEmail.parent().removeClass("success").addClass("error");
            } else {
                contactEmail.parent().removeClass("error").addClass("success");
            }
        }else{
            contactEmail.parent().removeAttr("class");  
        }
    });

    // Phone Validation
    contactPhone.on("keyup", function() {
        if ( ( $(this).val().trim().length ) > 0) {
            if (! ($(this).conformyPhoneValidate() === true) ) {
                contactPhone.parent().removeClass("success").addClass("error");
            } else {
                contactPhone.parent().removeClass("error").addClass("success");
            }
        }else{
            contactPhone.parent().removeAttr("class");
            contactPhone.parent().addClass("error");  
        }
    });


    $("select[name=contact_subject]").on("change", function(item){
        var item = $(this);

        var sNull  = $('select[name="contact_subject"]').find("option").eq(0).val();

        if( item.val() == sNull ) {
            $('select[name="contact_subject"]').parent().removeClass("success").addClass("error");
        }else {
            $('select[name="contact_subject"]').parent().removeClass("error").addClass("success");
        }
    });



    // Form Control Validate
    $(".cf-form-control:not('[name=contact_email],[name=contact_phone]')").on("keyup", function() {
        if ($(this).val().trim().length > 0) {
            $(this).parent().removeClass("error").addClass("success");
        }else {
            $(this).parent().removeAttr("class");
            $(this).parent().addClass("error");
        }
    });

    //  Captcha Variables    
    let textCaptcha     = $("#txtCaptcha");
    let textCaptchaSpan = $('#txtCaptchaSpan');
    let textInput       = $('#txtInput');

    // Generates the Random number function 
    function randomNumber(){
         
        let a = Math.ceil(Math.random() * 9) + '',
            b = Math.ceil(Math.random() * 9) + '',
            c = Math.ceil(Math.random() * 9) + '',
            d = Math.ceil(Math.random() * 9) + '',
            e = Math.ceil(Math.random() * 9) + '',
            code = a + b + c + d + e;
   
        textCaptcha.val(code);
        textCaptchaSpan.html(code);
    }

    // Called random number function
    randomNumber();

    // Validate the Entered input aganist the generated security code function   
    function validateCaptcha() {
        let str1 = textCaptcha.val();
        let str2 = textInput.val();
        if (str1 == str2) {
            return true;
        } else {
            return false;
        }
    }

    // Form Conttrol Captcha Validate
    textInput.on("keyup", function() {
        if (validateCaptcha() == true) {
            $(this).parent().removeClass("error").addClass("success");
        }else {
            $(this).parent().removeAttr("class");
            $(this).parent().addClass("error");
        }
    });

    // Contact Form Submit
//    $("#contactForm").on("submit", function(event) {
    $("#send_message").on("click", function(event) {

        //  Contact Form Input Value 
		var $this			= $('#contactForm');
        
        var contact_name  = $this.find('input[name="contact_name"]').val().trim();
        var contact_email = $this.find('input[name="contact_email"]').val().trim();
        var contact_phone = $this.find('input[name="contact_phone"]').val().trim();
        var contact_subject = $this.find('select[name="contact_subject"]').val().trim();
        var contact_message = $this.find('textarea[name="contact_message"]').val().trim();
        var validateEmail = $this.find('input[name="contact_email"]').conformyEmailValidate();
        var validatePhone = $this.find('input[name="contact_phone"]').conformyPhoneValidate();
        var selectedNull  = $this.find('select[name="contact_subject"]').find("option").eq(0).val();


        if (contact_name =='' || contact_email =='' || contact_phone == '' || contact_message == '' || textInput == '' || contact_subject == selectedNull) {
            $this.find("li").addClass("error");

            if($("#empty-form").css("display") == "none"){
                $('#empty-form').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (!validateEmail === true) {
            $('input[name="contact_email"]').parent().removeClass("success").addClass("error");
            if($('#email-invalid').css("display") == "none"){
                $('#email-invalid').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (contact_subject == selectedNull) {
            $('select[name="contact_subject"]').parent().removeClass("success").addClass("error");
            if($('#subject-alert').css("display") == "none"){
                $('#subject-alert').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (!validatePhone === true) {
            $('input[name="contact_phone"]').parent().removeClass("success").addClass("error");
            if($('#phone-invalid').css("display") == "none"){
                $('#phone-invalid').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (validateCaptcha() != true){
            $("#textInput").parent().find("span").removeClass("success").addClass("error");
            if($('#security-alert').css("display") == "none"){
                $('#security-alert').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else {
            $this.find(':submit').append('<span class="fas fa-spinner fa-pulse ms-3"></span>');
            $this.find(':submit').attr('disabled','true');
            $.ajax({
                url: "vendor/send_mail.php?mail=request",
                data: {
                    contact_name: contact_name,
                    contact_email: contact_email,
                    contact_phone: contact_phone,
                    contact_subject: contact_subject,
                    contact_message: contact_message
                },
                type: "POST",
                success: function(response) {
                    $(".cf-form-control").parent().removeAttr("class");
                    $("#contactForm")[0].reset();
                    if (response == true) {
                        $this.find(':submit').removeAttr('disabled');
                        $this.find(':submit').find("span").fadeOut();
                        $('#success_mail').show();
                        $('#success_mail').stop().slideDown().delay(3000).slideUp();
                        // Called random number function
                        randomNumber();
                    } else {
                        $this.find(':submit').removeAttr('disabled');
                        $this.find(':submit').find("span").fadeOut()
                        $("#error_mail").find("p").html(response);
                        $('#error_mail').stop().slideDown().delay(3000).slideUp();
                        // Called random number function
                        randomNumber();
                    }
                }
            });
        }
        event.preventDefault();
		
		return false;
    });
})(window.jQuery);
