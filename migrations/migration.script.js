const dataMigration = async(db)=>{
    try{
        const admin = await await db.users.findOne({where:{username:'admin@gmail.com'}});
        if(!admin){
            let result = await db.users.create({
                username: 'admin@gmail.com',
                password:'123456',
                role:'admin',
                status: true,
                company_id: 0
            });
        }
    }catch(e){
        console.log(e);
    }
}

module.exports = {dataMigration}