class User{

    constructor(name, gender,birth, country, email, password, photo, admin){
        // underline = 'privada'
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    // getters and setters

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }
    // name
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }

    // gender
    get gender(){
        return this._gender;
    }
    set gender(value){
        this._gender = value;
    }
    // email
    get email(){
        return this._email;
    }
    set email(value){
        this._email = value;
    }

    // birth
    get birth(){
        return this._birth
    }
    set birth(value){
        this._birth = value;
    }

    // country
    get country(){
        return this._country;
    }
    set country(value){
        this._country = value;
    }

    // photo
    get photo(){
        return this._photo;
    }
    set photo(value){
        this._photo = value;
    }
    // admin
    get admin(){
        return this._admin;
    }
    set admin(value){
        this._admin  =value;
    }

    // password
    get password(){
        return this._password;
    }
    set password(value){
        this._password = value;
    }


    loadFromJson(json){
        
        for(let name in json){
            
            switch(name){
                case'_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] =json[name];

                }
        }
    }

    getNewID(){
        
        let usersID = parseInt(localStorage.getItem('usersID'));
        if(!usersID.id) window.id =0;

        id++;

        localStorage.setItem('usersID', usersID);

        return usersID;

    }

    static getUsersStorage(){
        let users = [];
        
        if(localStorage.getItem('users')){
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }

    save(){
         
        let users = User.getUsersStorage(); 
        
       if(this.id > 0){
       
            users.map(u => {
                if(u._id == this.id){
                    
                    Object.assign(u,this);
                    console.log(this);
                }
                return u;
            });
 
        } else {
           
            this._id = this.getNewID();
            // colocar o json dentro de um array para poder salva-lo
            users.push(this);
       }
        

        // nao salva objetos Json
        //sessionStorage.setItem('users',JSON.stringify(users));
        localStorage.setItem('users',JSON.stringify(users));
    }

    remove(){

        let users = User.getUsersStorage(); 

        users.forEach((userdata, index) =>{

            if( this._id == userdata._id)
                users.splice(index, 1);
        });

        localStorage.setItem('users',JSON.stringify(users));

    }
}