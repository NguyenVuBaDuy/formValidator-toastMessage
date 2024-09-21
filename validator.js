import { showToastMessage } from './toastMessage.js';
function Validator(option){

    function getParent(inputElement, selector){
        var element = inputElement;
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, option.group).querySelector(option.errorBlock);
        var rules = selectorRules[rule.selector];
        var check = true;
        var errorMessage;
        for(var i = 0; i < rules.length; i++){
            switch(inputElement.type){
                case 'radio': case 'checkbox':
                    check = false;
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break;
                default: 
                errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage)break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            errorElement.classList.add('invalid');
            if(check)inputElement.classList.add('invalid1');
        } else {
            errorElement.innerText = "";
            errorElement.classList.remove('invalid');
            inputElement.classList.remove('invalid1');
        }
        return !errorMessage;
    }

    function startInput(inputElement){
        var errorElement = getParent(inputElement, option.group).querySelector(option.errorBlock);
        errorElement.innerText = "";
        errorElement.classList.remove('invalid');
        inputElement.classList.remove('invalid1');
    }

    function submit(){
        var isFormValid = true;
        option.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement,rule);
            if(!isValid){
                isFormValid = false;
            }
        })
        if(isFormValid){
            if(typeof option.onSubmit === 'function'){
                var enableElement = formElement.querySelectorAll('[name]');
                var formValue = Array.from(enableElement).reduce(function(accumulate, currentValue){
                    switch(currentValue.type){
                        case 'radio': 
                            if(currentValue.checked){
                                accumulate[currentValue.name] = currentValue.value;
                            }
                            break;
                        case 'checkbox':
                            if(!accumulate[currentValue.name]){
                                if(currentValue.checked)accumulate[currentValue.name] = [currentValue.value];
                                else accumulate[currentValue.name] = [];
                            } else if(currentValue.checked)accumulate[currentValue.name].push(currentValue.value);
                            break;
                        default: 
                        accumulate[currentValue.name] = currentValue.value;
                    }
                    return accumulate;
                }, {})
                

                option.onSubmit(formValue);

                showToastMessage('Registered successfully!','success','Congratulations on your successful account registration');
            }
        } else showToastMessage('Registration failed!','error','Please fill in the information completely and accurately');
    }
    var selectorRules = {};
    var formElement = document.querySelector(option.form);
    if(formElement){
        option.rules.forEach(function(rule){

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function(inputElement){
                if(inputElement){
                //Hành động blur
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }

                //Hành động bắt đầu nhập
                inputElement.oninput = function(){
                    startInput(inputElement);
                }

                //Hành động submit
                formElement.onsubmit = function(e){
                    e.preventDefault();
                    submit();
                }
            }
            })
        })
    }

}

Validator.isRequire = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || "Please enter your information!";
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Invalid information!";
        }
    }
}

Validator.isPasswordMinLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.trim().length >= min ? undefined : `Please enter at least ${min} characters!`
        }
    }
}

Validator.isConfirmPassword = function(selector, getPasswordValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === getPasswordValue() ? undefined : message;
        }
    }
}

Validator.isUsername = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return !(/\s/.test(value)) ? undefined : message;
        }
    }
}



Validator.isRequireCheck = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : message;
        }
    }
}

//Call function
Validator({
    chat: 'hello',
    form: '#form-1',
    errorBlock: '.form-warning',
    group: '.form-group',
    rules: [
        Validator.isRequire('#username','Please enter your username!'),
        Validator.isUsername('#username', 'Invalid username!'),
        Validator.isRequire('#email', 'Please enter your email!'),
        Validator.isEmail('#email', 'Invalid email!'),
        Validator.isRequire('#password', 'Please enter your password!'),
        Validator.isPasswordMinLength('#password', 6),
        Validator.isRequire('#password-confirm','Please confirm your password!'),
        Validator.isConfirmPassword('#password-confirm', function(){
            return document.querySelector('#form-1 #password').value;
        }, 'Passwords do not match!'),
        Validator.isRequireCheck('input[name="age"]',"Cannot be left blank!")
    ],
    onSubmit: function(data){
        console.log(data);
    }
});