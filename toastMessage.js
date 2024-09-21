function getParent(element, selector){
    while(element.parentElement){
        if(element.parentElement.matches(selector)){
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

var icons = {
    success: "fa-solid fa-circle-check",
    error: "fa-solid fa-circle-exclamation",
    warning: "fa-solid fa-circle-exclamation",
    info: "fa-solid fa-circle-info"
}
function toast({
    title = 'Info',
    message = "Default message",
    type = 'info',
    duration = 3000
}){
    const main = document.getElementById('toast');
    if(main){
        const toastElement = document.createElement('div');
        toastElement.classList.add('toast', `toast--${type}`);
        toastElement.style.animation = `slideInLeft ease .3s, disappear ease 1s 3s forwards`;
        var icon = icons[type];
        toastElement.innerHTML = `
            <div class="toast__icon">
                    <i class="${icon}"></i>
                </div>
                <div class="toast__body">
                    <h2 class="toast__title">
                        ${title}
                    </h2>
                    <div class="toast__msg">
                    ${message}
                    </div> 
                </div>
                <div class="toast__close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
        `;
        main.appendChild(toastElement);
        var closeElement = toastElement.querySelector('.toast__close');

        setTimeout(function(){
            main.removeChild(toastElement);
        }, 4000);

        if(closeElement){
            closeElement.onclick = function(event){
                main.removeChild(toastElement);
            }
        }
    }
}



export function showToastMessage(title, type, message = '') {
    var main = document.getElementById('btn');
    if(main){
        toast({
            title: title,
            message: message,
            type: type,
            duration: 3000
        });
    }
}

