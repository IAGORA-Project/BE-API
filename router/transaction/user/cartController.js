const { Cart } = require("../../../db/Cart")
const { Product } = require("../../../db/Product")
const { User } = require("../../../db/User")
const { basicResponse } = require("../../../utils/basic-response")

const addToCart = async (req, res) => {
  const { userId, productId } = req.params

  try {
    const user = await User.findById(userId)

    if(user) {
      const product = await Product.findById(productId)
      
      if(product) {
        const cart = await Cart.findOne({ user: user._id })

        if(cart) {
          let products = cart.products
          const filterProduct = products.filter(prd => prd.product.toString() === product._id.toString())[0]
          if(filterProduct) {
            filterProduct.quantity = filterProduct.quantity + 1
            filterProduct.subTotal = filterProduct.quantity * product.product_price
            
            const productsIndex = products.findIndex(p => p.product.toString() === filterProduct.product.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = null
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })
          } else {
            const newProductCart = await Cart.findOne({ _id: cart._id })
            newProductCart.products.push({
              product: product._id,
              quantity: 1,
              subTotal: product.product_price
            })

            await newProductCart.save()

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = null
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })
          }

          const updatedCart = await Cart.findOne({ user: user._id }).populate('products.product')

          return res.status(200).json(basicResponse({
            status: res.statusCode,
            message: `Cart id: ${cart._id} updated`,
            result: updatedCart
          }))
        }
        
        const createCart = await Cart.create({ 
          user: user._id,
          products: [
            {
              product: product._id,
              quantity: 1,
              subTotal: product.product_price
            }
          ],
          total: product.product_price
        })

        if(createCart) {
          user.cart = createCart._id
          await user.save()
        }

        const updatedCart = await Cart.findOne({ user: user._id }).populate('products.product')

        return res.status(201).json(basicResponse({
          status: res.statusCode,
          message: 'Cart berhasil ditambahkan',
          result: updatedCart
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
        const cart = await Cart.findOne({ user: user._id })

        if(cart) {
          let products = cart.products
          const filterProduct = products.filter(prd => prd.product.toString() === product._id.toString())[0]

          if(filterProduct) {
            filterProduct.quantity = quantity
            filterProduct.subTotal = filterProduct.quantity * product.product_price
            
            const productsIndex = products.findIndex(p => p.product.toString() === filterProduct.product.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = null
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })

            return res.status(200).json(basicResponse({
              status: res.statusCode,
              message: `Cart id: ${cart._id} updated`,
              result: await Cart.findOne({ user: user._id }).populate('products.product')
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
          const filterProduct = products.filter(prd => prd.product.toString() === product._id.toString())[0]

          if(filterProduct) {
            const productsIndex = products.findIndex(p => p.product.toString() === filterProduct.product.toString())

            products.splice(productsIndex, 1)

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            const updatedCart = await Cart.findOne({ user: user._id })
            let countTotal = null
            updatedCart.products.map(p => {
              countTotal += p.subTotal
            })
            await Cart.updateOne({ user: user._id }, { total: countTotal })

            return res.status(200).json(basicResponse({
              status: res.statusCode,
              message: `Cart id: ${cart._id} updated`,
              result: await Cart.findOne({ user: user._id }).populate('products.product')
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
        await cart.save()
        
        await Cart.updateOne({ user: user._id }, { total: 0 })

        return res.status(202).json(basicResponse({
          status: res.statusCode,
          message: `Cart id: ${cart._id} berhasil dihapus.`
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
      const cart = await Cart.findOne({ user: user._id }).populate('products.product')
      
      if(cart) {
        return res.status(200).json(basicResponse({
          status: res.statusCode,
          message: `User ${user.nama} carts`,
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