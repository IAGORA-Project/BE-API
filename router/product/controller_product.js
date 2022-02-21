const { Product } = require("../../db/Product");
const { respons } = require("../../lib/setting");
const fs = require('fs');
const { basicResponse } = require("../../utils/basic-response");

async function create_product(req, res) {
    try {
        const { product_name, product_category, product_grade, product_price, product_uom } = req.body;
        const product_image = req.file

        if(!product_image) {
            return res.status(422).json(basicResponse(res.statusCode, 'Gambar produk wajib diisi.'))
        }

        const create = await Product.create({ 
            product_name, 
            product_category, 
            product_grade, 
            product_image: product_image.filename, 
            product_price,
            product_uom
        });
        return res.status(201).json(basicResponse({
            status: res.statusCode,
            message: 'Produk berhasil ditambahkan.',
            result: create
        }))

    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        })); 
    }
}

async function product_one(req, res) {
    try {
        let { ids } = req.params;
        if (!ids) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let find = await Product.findOne({_id: ids});
        if(find) {
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Data Product ${ids} Ditemukan`,
                result: find
            })
        }
        
        return res.status(404).send({
            status: res.statusCode,
            code: respons.ProductNotFound,
            message: `Data Product ${ids} not found`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function product_all(req, res) {
    try {
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

        let { product_name, product_category, product_grade, product_price, product_uom } = req.body;
        let product_image = req.file

        let { ids } = req.params;
        if (!ids) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })

        let find = await Product.findOne({_id: ids});
        
        let nameP = product_name ? product_name : find.product_name;
        let caetgoryP = product_category ? product_category : find.product_category;
        let gradeP = product_grade ? product_grade : find.product_grade;
        let imgP = find.product_image;
        let priceP = product_price ? product_price : find.product_price;
        let uomP = product_uom ? product_uom : find.product_uom;

        if(product_image) {
            fs.unlinkSync(`./public/images/products/${imgP}`)
            imgP = product_image.filename
        }

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

        const product = await Product.findById(ids)

        if(product) {
            product.remove()

            fs.unlinkSync(`./public/images/products/${product.product_image}`)
            
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Delete : ${ids}`
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_all_product(req, res) {
    try {
        await Product.deleteMany({});
        fs.readdirSync('./public/images/products').forEach(f => fs.rmSync(`${'./public/images/products'}/${f}`));
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