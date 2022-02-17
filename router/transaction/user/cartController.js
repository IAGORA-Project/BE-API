const { Cart } = require("../../../db/Cart")
const { Product } = require("../../../db/Product")
const { User } = require("../../../db/User")

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
            filterProduct.total = filterProduct.quantity * product.product_price
            
            const productsIndex = products.findIndex(p => p.product.toString() === filterProduct.product.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })
          } else {
            const newProductCart = await Cart.findOne({ _id: cart._id })
            newProductCart.products.push({
              product: product._id,
              quantity: 1,
              total: product.product_price
            })

            await newProductCart.save()
          }

          return res.status(200).json({ success: `Cart id: ${cart._id} updated` })
        }
        
        const createCart = await Cart.create({ 
          user: user._id,
          products: [
            {
              product: product._id,
              quantity: 1,
              total: product.product_price
            }
          ]
        })

        if(createCart) {
          user.cart = createCart._id
          await user.save()
        }

        return res.status(201).json({ success: `Cart berhasil ditambahkan`, data: createCart })
      }

      return res.status(404).json({ notFound: `Product dengan id: ${productId} tidak ditemukan!` })
    }

    return res.status(404).json({ notFound: `User dengan id: ${userId} tidak ditemukan!` })
  } catch (error) {
    return res.status(500).json({ error })
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
            filterProduct.total = filterProduct.quantity * product.product_price
            
            const productsIndex = products.findIndex(p => p.product.toString() === filterProduct.product.toString())

            products[productsIndex] = filterProduct

            await Cart.updateOne({ _id: cart._id }, { products }, { new: true })

            return res.status(200).json({ success: `Cart id: ${cart._id} updated` })
          }

          return res.status(404).json({ notFound: 'Produk belum di tambahkan kedalam cart, tambahkan terlebih dahulu!' })
        }

        return res.status(404).json({ notFound: 'Cart anda masih kosong, silahkan tambahkan product terlebih dahulu!' })
      }

      return res.status(404).json({ notFound: `Product dengan id: ${productId} tidak ditemukan!` })
    }

    return res.status(404).json({ notFound: `User dengan id: ${userId} tidak ditemukan!` })
  } catch (error) {
    return res.status(500).json({ error })
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

            return res.status(200).json({ success: `Cart id: ${cart._id} updated` })
          }

          return res.status(404).json({ notFound: 'Produk belum di tambahkan kedalam cart, tambahkan terlebih dahulu!' })
        }

        return res.status(404).json({ notFound: 'Cart anda masih kosong, silahkan tambahkan product terlebih dahulu!' })
      }

      return res.status(404).json({ notFound: `Product dengan id: ${productId} tidak ditemukan!` })
    }

    return res.status(404).json({ notFound: `User dengan id: ${userId} tidak ditemukan!` })
  } catch (error) {
    return res.status(500).json({ error })
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

        return res.status(202).json({ success: `Cart id: ${cart._id} berhasil dihapus.` })
      }

      return res.status(404).json({ notFound: 'Cart anda masih kosong.' })
    }

    return res.status(404).json({ notFound: `User dengan id: ${userId} tidak ditemukan!` })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const getUserCart = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)

    if(user) {
      const cart = await Cart.findOne({ user: user._id })
      
      if(cart) {
        return res.status(200).json({ cart })
      }

      return res.status(404).json({ notFound: 'Cart anda masih kosong.' })
    }

    return res.status(404).json({ notFound: `User dengan id: ${userId} tidak ditemukan!` })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

module.exports = {
  addToCart,
  updateQuantity,
  deleteOneProductCart,
  deleteAllCart,
  getUserCart
}