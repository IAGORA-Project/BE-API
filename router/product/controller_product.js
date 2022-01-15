const { Product } = require("../../db/Product");

async function create_product(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { product_name, product_category, product_grade, product_image, product_price, product_uom } = req.body;
        if (!product_name || !product_category || !product_grade || !product_image || !product_price || !product_uom) return res.status(404).send({
            status: 404,
            message: 'Input all body'
        })
        const create = await Product.create({ 
            product_name: Buffer.from(product_name, 'utf8').toString('hex'), 
            product_category: Buffer.from(product_category, 'utf8').toString('hex'), 
            product_grade: Buffer.from(product_grade, 'utf8').toString('hex'), 
            product_image, 
            product_price: Buffer.from(product_price, 'utf8').toString('hex'), 
            product_uom:Buffer.from(product_uom, 'utf8').toString('hex')
        });
        res.status(200).send(create)

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function product_one(req, res) {
    try {
        let { ids } = req.params;
        let find = await Product.findOne({_id: ids});
        if (find) {
            res.status(200).json({
                status: 200,
                result: find
            })
        } else {
            res.status(404).send({
                status: 404,
                message: 'not found'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function product_all(req, res) {
    try {    
        const heads = req.header('buff');
        if (heads == 'no buff') {
            let find = await Product.find({});
            if (find) {
                let result = []
                for (let i = 0; i < find.length; i++) {
                    result[i] = {
                        product_name: Buffer.from(find[i].product_name, 'hex').toString('utf8'), 
                        product_category: Buffer.from(find[i].product_category, 'hex').toString('utf8'), 
                        product_grade: Buffer.from(find[i].product_grade, 'hex').toString('utf8'),  
                        product_image: find[i].product_image, 
                        product_price: Buffer.from(find[i].product_price, 'hex').toString('utf8'), 
                        product_uom:Buffer.from(find[i].product_uom, 'hex').toString('utf8')
                    }
                }
                return res.status(200).send({
                    status: 200,
                    result
                })
            } else {
                res.status(404).send({
                    status: 404,
                    message: 'not found'
                })
            }
        } else {
            let find = await Product.find({});
            if (find) {
                res.status(200).send({
                    status: 200,
                    result: find
                })
            } else {
                res.status(404).send({
                    status: 404,
                    message: 'not found'
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function product_update(req, res) {
    try {
        if (!req.params.ids || !req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body and params'
        })
        let { product_name, product_category, product_grade, product_image, product_price, product_uom } = req.body;
        let { ids } = req.params;

        let find = await Product.findOne({_id: ids});
        let nameP = product_name ? Buffer.from(product_name, 'utf8').toString('hex') : find.product_name;
        let caetgoryP = product_category ? Buffer.from(product_category, 'utf8').toString('hex') : find.product_category;
        let gradeP = product_grade ? Buffer.from(product_grade, 'utf8').toString('hex') : find.product_grade;
        let imgP = product_image ? Buffer.from(product_image, 'utf8').toString('hex') : find.product_image;
        let priceP = product_price ? Buffer.from(product_price, 'utf8').toString('hex') : find.product_price;
        let uomP = product_uom ? Buffer.from(product_uom, 'utf8').toString('hex') : find.product_uom;

        if (find) {
            Product.updateOne({ _id: ids }, { product_name: nameP, product_category: caetgoryP, product_grade: gradeP,
                product_image: imgP, product_price: priceP, product_uom: uomP }, function (err, res) {
                    if (err) throw err;
                })
            return res.status(200).send({
                status: 200,
                result: `sukses update data : ${ids}`
            })
        } else {
            res.status(404).send({
                status: 404,
                message: 'not found'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_one_product(req, res) {
    try {
        if (!req.params.ids || Object.keys(req.params).length === 0) return res.status(404).send({
            status: 404,
            message: 'input params'
        })
        let { ids } = req.params;
        Product.deleteOne({ _id: ids }, function (err, res) {
            if (err) throw err;
        })
        return res.status(200).send({
            status: 200,
            message: `Sukses Delete : ${ids}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_all_product(req, res) {
    try {
        await Product.deleteMany({});
        return res.status(200).send({
            status: 200,
            message: `Sukses Delete all product`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

module.exports = {
    create_product,
    product_one,
    product_all,
    product_update,
    delete_one_product,
    delete_all_product
}