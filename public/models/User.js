
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
                    if(name.substring(0,1)=='_')    this[name] =json[name];

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
    toJSON(){
       
        let json= {};   
       
        Object.keys(this).forEach(key=>{
            if(this[key]!== undefined)json[key] = this[key];
        });
       
        return json;
    }

    save(){
        
        return new Promise((resolve, reject)=>{
            let promise;
            if(this.id){

                promise = HttpRequest.put(`/users/${this.id}`,this.toJSON());
            } else {
                console.log('hahahah');
                promise = HttpRequest.post(`/users`,this.toJSON());
            }
            console.log(this.id);
            promise.then(data=>{
                this.loadFromJson(data);
                resolve(this);
            }).catch(e=>{
                reject(e);
            });
        });
        
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