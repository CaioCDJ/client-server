
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

    static getUsersStorage(){
        
        return Fetch.get('/users');
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

                promise = Fetch.put(`/users/${this.id}`,this.toJSON());
            } else {
                promise = Fetch.post(`/users`,this.toJSON());
            }
            promise.then(data=>{
                this.loadFromJson(data);
                resolve(this);
            }).catch(e=>{
                reject(e);
            });
        });
        
    }

    remove(){

        return Fetch.delete(`/users/${this.id}`);
    }
}