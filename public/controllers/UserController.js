class UserController{

    constructor(formId,formIdUpdate, tableId){

        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
        this.selectAll();
        this.updateCount();
    }

    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click',e=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', event=>{
            
            event.preventDefault();
            
            let btn  = this.formEl.querySelector('[type=submit');

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);
            
            let index = this.formUpdateEl.dataset.trIndex;
            
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({},userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content)=>{
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else{
                        console.log(result._photo+"\n"+content);
                        result._photo = content;
                    }
                    let user = new User();
                    user.loadFromJson(result); 
                    
                    user.save();

                    this.getTr(user,tr);                    
                    
                    this.updateCount();
                    
                    this.showPanelCreate();
                    
                    this.formUpdateEl.reset();

                    btn.disabled = false;
                },()=>{
                    // erros
                    console.error(e)
            });
            
        });
    }

    addEventsTr(tr){
        
        // deletar conta
        tr.querySelector(".btn-delete").addEventListener('click',e=>{
            
            if (confirm("Deseja realmente excluir a conta?")) {
            
                let user = new User();
                user.loadFromJson(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });

        // edicao de contas
        tr.querySelector(".btn-edit").addEventListener('click',e=>{
            
            let json = JSON.parse(tr.dataset.user);
            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                
                let field = this.formUpdateEl.querySelector('[name='+name.replace('_','')+']');
                
                if(field){

                    switch (field.type) {
                        
                        case 'file':
                            continue;
                        break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;
                        
                        default:
                            field.value = json[name];
                    }
                    field.value = json[name];
                }
                
            } 
            this.formUpdateEl.querySelector('.photo').src= json._photo;  
            this.showPanelUpdate();
        });
    }
    onSubmit(){
        
        // envio de Formulario
        this.formEl.addEventListener('submit',(event) => {
        
            // cancela o comportamento padrao do evento
            event.preventDefault();

            let btn  = this.formEl.querySelector('[type=submit');

            btn.disabled = true;

            let values  = this.getValues(this.formEl);
    
            if(!values) return false;

            this.getPhoto(this.formEl).then(
                (content)=>{
            
                    // sucesso na execucao
            
                    values.photo = content;
            
                    values.save();
                    console.log(values);
                    this.addLine(values); 
            
                    this.formEl.reset();
                    
                    btn.disabled = false;

                },
                (e)=>{
                    // erros
                    console.error(e)
            });
        });
    }

    getPhoto(formEl){
        
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
        
            let elements = [...formEl.elements].filter(item=>{

                if(item.name =='photo')
                    return item;
            });

            let file = elements[0].files[0];

            fileReader.onload = ()=>{
                resolve(fileReader.result);
            };
        
            fileReader.onerror=(e)=>{
                reject(e);
            }
            if (file) {
                fileReader.readAsDataURL(file);
            } else{
                resolve('dist/img/boxed-bg.jpg');
            }
        });
        
    }

    getValues(formEl){
            
        let user = {};
        let isValid = true;

        // verificando campos
        // colchetes = spread
        [...formEl.elements].forEach(function(field, index){

            if(['name','email','password'].indexOf(field.name)> -1 && !field.value){

                field.parentElement.classList.add('has-error');
                isValid  =false;
            }

            if(field.name == "gender"){

                if(field.checked){
                  user[field.name] = field.value;
                }

            } else if(field.name =='admin'){

                user[field.name] = field.checked;

            }else{
                user[field.name] = field.value;
            }
        
        });

        if(!isValid){
            return false;
        }
        return new User(user.name, user.gender, 
            user.birth, user.country,user.email,
            user.password, user.photo, user.admin);
        
    }

    getUsersStorage(){
        let users = [];
        
        if(localStorage.getItem('users')){
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }

    selectAll(){
        // let users = User.getUsersStorage();

        let ajax = new XMLHttpRequest();

        ajax.open('GET','/users');

        ajax.onload = event =>{
        
            let obj = {users:[]};

            try {
                obj = JSON.parse(ajax.responseText);
            } catch (error) {
              console.error(error);
            }
        
            obj.users.forEach(dataUser=>{
                let user = new User();
    
                user.loadFromJson(dataUser);
                this.addLine(user);
            })
    
        }
        ajax.send();
    }
  
    // adiciona um novo usuario na tabela
    addLine(dataUser) {

        let tr = this.getTr(dataUser);        
                
        this.addEventsTr(tr);
        this.tableEl.appendChild(tr);
    }
                
    getTr(dataUser, tr = null){
        
        if(tr == null) tr = document.createElement('tr');
       
        tr.dataset.user = JSON.stringify(dataUser);


        tr.innerHTML = ` 
         
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim': 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-edit btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-delete btn-flat">Excluir</button>
            </td>
        `;
        this.addEventsTr(tr);
        return tr;
    }

    showPanelCreate(){
        document.querySelector("#box-user-update").style.display = "none";
        document.querySelector("#box-user-create").style.display = "block";
    }
    showPanelUpdate(){
        document.querySelector("#box-user-update").style.display = "block";
        document.querySelector("#box-user-create").style.display = "none";

    }

    updateCount(){
        let numberUsers =  0;
        let numberAdmin = 0;
        
        [...this.tableEl.children].forEach(tr => {
            
            numberUsers++;
            
            let user = JSON.parse(tr.dataset.user);
            if(user._admin) 
                numberAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
}   