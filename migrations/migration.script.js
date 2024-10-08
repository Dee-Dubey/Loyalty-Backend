const dataMigration = async(db)=>{
    try{
        const admin = await await db.users.findOne({where:{email:'admin@gmail.com'}});
        if(!admin){
            let result = await db.users.upsert({
                name: 'admin',
                contact:'9999999999',
                email:'admin@gmail.com',
                currencyType:'Rs',
                address:'',
                businessName:'',
                businessType:'',
                password:'123456',
                role:'admin'
            });
        }
    }catch(e){
        console.log(e);
    }
}

module.exports = {dataMigration}