const dataMigration = async(db)=>{
    try{
        const admin = await await db.users.findOne({where:{username:'admin@noemail.com'}});
        if(!admin){
            let result = await db.users.create({
                username: 'admin@noemail.com',
                password:'123456',
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