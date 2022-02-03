const { Product } = require("../../db/Product");
const { respons } = require("../../lib/setting");

async function create_product(req, res) {
    try {
        let { product_name, product_category, product_grade, product_image, product_price, product_uom } = req.body;
        if (!product_name || !product_category || !product_grade || !product_image || !product_price || !product_uom) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBody,
            message: "Input Body"
        })
        const create = await Product.create({ 
            product_name: Buffer.from(product_name, 'utf8').toString('hex'), 
            product_category: Buffer.from(product_category, 'utf8').toString('hex'), 
            product_grade: Buffer.from(product_grade, 'utf8').toString('hex'), 
            product_image, 
            product_price: Buffer.from(product_price, 'utf8').toString('hex'), 
            product_uom:Buffer.from(product_uom, 'utf8').toString('hex')
        });
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: `Sukses Create Product`,
            result: create
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function product_one(req, res) {
    try {
        const heads = req.header('buffer');
        let { ids } = req.params;
        if (!ids) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        if (heads == 'no buffer') {
            let find = await Product.findOne({_id: ids});
            if (find) {
                let alls = {
                    _id: find._id,
                    product_name: Buffer.from(find.product_name, 'hex').toString('utf8'), 
                    product_category: Buffer.from(find.product_category, 'hex').toString('utf8'), 
                    product_grade: Buffer.from(find.product_grade, 'hex').toString('utf8'),  
                    product_image: find.product_image, 
                    product_price: Buffer.from(find.product_price, 'hex').toString('utf8'), 
                    product_uom:Buffer.from(find.product_uom, 'hex').toString('utf8')
                }
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Data Product ${ids} Ditemukan`,
                    result: alls
                })
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.ProductNotFound,
                    message: `Data Product ${ids} not found`
                })
            }
        } else {
            let find = await Product.findOne({_id: ids});
            if (find) {
                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Data Product ${ids} Ditemukan`,
                    result: find
                })
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.ProductNotFound,
                    message: `Data Product ${ids} not found`
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function product_all(req, res) {
    try {    
        const heads = req.header('buffer');
        if (heads == 'no buffer') {
            let find = await Product.find({});
            if (find) {
                let result = []
                for (let i = 0; i < find.length; i++) {
                    result[i] = {
                        _id: find[i]._id,
                        product_name: Buffer.from(find[i].product_name, 'hex').toString('utf8'), 
                        product_category: Buffer.from(find[i].product_category, 'hex').toString('utf8'), 
                        product_grade: Buffer.from(find[i].product_grade, 'hex').toString('utf8'),  
                        product_image: find[i].product_image, 
                        product_price: Buffer.from(find[i].product_price, 'hex').toString('utf8'), 
                        product_uom:Buffer.from(find[i].product_uom, 'hex').toString('utf8')
                    }
                }
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Menampilkan Semua Data Product`,
                    result
                })
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.ProductNotFound,
                    message: `Data Product not found`
                })
            }
        } else {
            let find = await Product.find({});
            if (find) {
                res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Menampilkan Semua Data Product`,
                    result: find
                })
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.ProductNotFound,
                    message: `Data Product not found`
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function product_update(req, res) {
    try {
        if (!req.body) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBody,
            message: "Input Body"
        })
        let { product_name, product_category, product_grade, product_image, product_price, product_uom } = req.body;
        let { ids } = req.params;
        if (!ids) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })

        let find = await Product.findOne({_id: ids});
        let nameP = product_name ? Buffer.from(product_name, 'utf8').toString('hex') : find.product_name;
        let caetgoryP = product_category ? Buffer.from(product_category, 'utf8').toString('hex') : find.product_category;
        let gradeP = product_grade ? Buffer.from(product_grade, 'utf8').toString('hex') : find.product_grade;
        let imgP = product_image ? product_image : find.product_image;
        let priceP = product_price ? Buffer.from(product_price, 'utf8').toString('hex') : find.product_price;
        let uomP = product_uom ? Buffer.from(product_uom, 'utf8').toString('hex') : find.product_uom;

        if (find) {
            let obj = { product_name: nameP, product_category: caetgoryP, product_grade: gradeP,
                product_image: imgP, product_price: priceP, product_uom: uomP }

            Product.updateOne({ _id: ids }, obj, function (err, res) {
                    if (err) throw err;
                })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Update Data Product ${ids}`,
                result: obj
            })
        } else {
            res.status(404).send({
                status: res.statusCode,
                code: respons.ProductNotFound,
                message: `Data Product ${ids} not found`
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_one_product(req, res) {
    try {
        let { ids } = req.params;
        if (!ids) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        Product.deleteOne({ _id: ids }, function (err, res) {
            if (err) throw err;
        })
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: `Sukses Delete : ${ids}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_all_product(req, res) {
    try {
        await Product.deleteMany({});
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: `Sukses Delete all product`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
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