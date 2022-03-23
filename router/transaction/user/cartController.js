const { Cart } = require("../../../db/Cart")
const { Product } = require("../../../db/Product")
const { User } = require("../../../db/User")
const { basicResponse } = require("../../../utils/basic-response")

const addToCart = async (req, res) => {
  const { userId, productId } = req.params

  try {
    const user = await User.findById(userId)

    if(user) {
      const product = await Product.findById(productId).populate('product_grade')
      
      if(product) {
        const cart = await Cart.findOne({ user: user._id }).populate({
          path: 'products.productDetail',
          populate: 'product_grade'
        })

        if(cart) {
          let products = cart.products
          const filterProduct = products.find(prd => prd.productDetail._id.toString() === product._id.toString())
          if(filterProduct) {
            filterProduct.quantity = filterProduct.quantity + 1
            filterProduct.subTotal = (filterProduct.quantity * product.product_price) + (filterProduct.productDetail.product_grade.charge * filterProduct.quantity)
            
            const productsIndex = products.findIndex(p => p.productDetail._id.toString() === filterProduct.productDetail._id.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = 0
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })
          } else {
            const newProductCart = await Cart.findOne({ _id: cart._id })
            newProductCart.products.push({
              productDetail: product._id,
              quantity: 1,
              subTotal: product.product_price + product.product_grade.charge
            })

            await newProductCart.save()

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = 0
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })
          }

          const updatedCart = await Cart.findOne({ user: user._id }).populate({
            path: 'products.productDetail',
            select: '-market -isAccept -createdAt -updatedAt -__v -product_category',
            populate: {
              path: 'product_grade',
              select: '_id grade charge'
            }
          })

          return res.status(200).json(basicResponse({
            status: res.statusCode,
            message: `Cart id: ${cart._id} updated`,
            result: updatedCart
          }))
        }
        
        const createCart = new Cart({ 
          user: user._id,
          products: [
            {
              productDetail: product._id,
              quantity: 1,
              subTotal: product.product_price + product.product_grade.charge
            }
          ],
          total: product.product_price + product.product_grade.charge
        })
        await createCart.save()

        if(createCart) {
          user.cart = createCart._id
          await user.save()
        }

        return res.status(201).json(basicResponse({
          status: res.statusCode,
          message: 'Cart berhasil ditambahkan',
          result: await createCart.populate({
            path: 'products.productDetail',
            select: '-market -isAccept -createdAt -updatedAt -__v -product_category',
            populate: {
              path: 'product_grade',
              select: '_id grade charge'
            }
          })
        }))
      }

      return res.status(404).json(basicResponse({
        status: res.statusCode,
        message: `Product dengan id: ${productId} tidak ditemukan!`
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: `User dengan id: ${userId} tidak ditemukan!`
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

const updateQuantity = async (req, res) => {
  const { userId, productId } = req.params
  const { quantity } = req.body

  try {
    const user = await User.findById(userId)

    if(user) {
      const product = await Product.findById(productId)
      
      if(product) {
        const cart = await Cart.findOne({ user: user._id }).populate({
          path: 'products.productDetail',
          populate: 'product_grade'
        })

        if(cart) {
          let products = cart.products
          const filterProduct = products.find(prd => prd.productDetail._id.toString() === product._id.toString())
          
          if(filterProduct) {
            filterProduct.quantity = quantity
            filterProduct.subTotal = (filterProduct.quantity * product.product_price) + (filterProduct.productDetail.product_grade.charge * filterProduct.quantity)
            
            const productsIndex = products.findIndex(p => p.productDetail._id.toString() === filterProduct.productDetail._id.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = 0
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })

            return res.status(200).json(basicResponse({
              status: res.statusCode,
              message: `Cart id: ${cart._id} updated`,
              result: await Cart.findOne({ user: user._id }).populate({
                path: 'products.productDetail',
                select: '-market -isAccept -createdAt -updatedAt -__v -product_category',
                populate: {
                  path: 'product_grade',
                  select: '_id grade charge'
                }
              })
            }))
          }

          return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: 'Produk belum di tambahkan kedalam cart, tambahkan terlebih dahulu!'
          }))
        }

        return res.status(404).json(basicResponse({
          status: res.statusCode,
          message: 'Cart anda masih kosong, silahkan tambahkan product terlebih dahulu!'
        }))
      }

      return res.status(404).json(basicResponse({
        status: res.statusCode,
        message: `Product dengan id: ${productId} tidak ditemukan!`
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: `User dengan id: ${userId} tidak ditemukan!`
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode
    }))
  }
}

const deleteOneProductCart = async (req, res) => {
  const { userId, productId } = req.params

  try {
    const user = await User.findById(userId)

    if(user) {
      const product = await Product.findById(productId)
      
      if(product) {
        const cart = await Cart.findOne({ user: user._id })
        
        if(cart) {
          let products = cart.products
          const filterProduct = products.find(prd => prd.productDetail.toString() === product._id.toString())
          
          if(filterProduct) {
            const productsIndex = products.findIndex(p => p.productDetail.toString() === filterProduct.productDetail.toString())

            products.splice(productsIndex, 1)

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = 0
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })

            return res.status(200).json(basicResponse({
              status: res.statusCode,
              message: `Cart id: ${cart._id} updated`,
              result: await Cart.findOne({ user: user._id }).populate({
                path: 'products.productDetail',
                select: '-market -isAccept -createdAt -updatedAt -__v -product_category',
                populate: {
                  path: 'product_grade',
                  select: '_id grade charge'
                }
              })
            }))
          }

          return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: 'Produk belum di tambahkan kedalam cart, tambahkan terlebih dahulu!'
          }))
        }

        return res.status(404).json(basicResponse({
          status: res.statusCode,
          message: 'Cart anda masih kosong, silahkan tambahkan product terlebih dahulu!'
        }))
      }

      return res.status(404).json(basicResponse({
        status: res.statusCode,
        message: `Product dengan id: ${productId} tidak ditemukan!`
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: `User dengan id: ${userId} tidak ditemukan!`
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode
    }))
  }
}

const deleteAllCart = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)

    if(user) {
      const cart = await Cart.findOne({ user: user._id })
      
      if(cart) {
        cart.products = []
        cart.total = 0
        await cart.save()

        return res.status(202).json(basicResponse({
          status: res.statusCode,
          message: `Cart id: ${cart._id} berhasil dihapus.`,
          result: cart
        }))
      }

      return res.status(404).json(basicResponse({
        status: res.statusCode,
        message: 'Cart anda masih kosong.'
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: `User dengan id: ${userId} tidak ditemukan!`
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode
    }))
  }
}

const getUserCart = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    
    if(user) {
      const cart = await Cart.findOne({ user: user._id }).populate({
        path: 'products.productDetail',
        select: '-market -isAccept -createdAt -updatedAt -__v -product_category',
        populate: {
          path: 'product_grade',
          select: '_id grade charge'
        }
      })
      
      if(cart) {
        return res.status(200).json(basicResponse({
          status: res.statusCode,
          message: `${user?.userDetail.name} carts`,
          result: cart
        }))
      }

      return res.status(404).json(basicResponse({
        status: res.statusCode,
        message: 'Cart anda masih kosong.'
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: `User dengan id: ${userId} tidak ditemukan!`
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode
    }))
  }
}

module.exports = {
  addToCart,
  updateQuantity,
  deleteOneProductCart,
  deleteAllCart,
  getUserCart
}