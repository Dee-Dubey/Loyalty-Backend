const dataMigration = async(db)=>{
    try{
        const admin = await await db.users.findOne({where:{email:'admin@gmail.com'}});
        if(!admin){
            let result = await db.users.create({
                username: 'admin',
                password:'123456',
                role:'admin',
                status: true,
                company_id: null
            });
        }
    }catch(e){
        console.log(e);
    }
}

module.exports = {dataMigration}