const dataMigration = async(db)=>{
    try{
        const admin = await await db.users.findOne({where:{username:'info@buypassme.com'}});
        if(!admin){
            let result = await db.users.create({
                username: 'info@buypassme.com',
                password:'Albert@2025',
                role:'admin',
                status: true,
                company_id: 0
            });
        }
    }catch(e){
        delete req.query.download;;
    }
}

module.exports = {dataMigration}