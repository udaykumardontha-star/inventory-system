from flask import Flask, request, jsonify
from flask_cors import CORS
from config import DATABASE_URL
from models import db, Product, Customer, Order, OrderItem
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

# create tables on startup, retry if db is not ready yet
with app.app_context():
    for i in range(10):
        try:
            db.create_all()
            print("Tables created!")
            break
        except Exception as e:
            print(f"DB not ready, retrying in 3s... ({e})")
            time.sleep(3)
@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Inventory System API is running. Access endpoints via /api"
    })


# ---- PRODUCT ROUTES ----

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()

    if not data.get('name') or not data.get('sku'):
        return jsonify({'error': 'Name and SKU are required'}), 400

    if data.get('price', 0) < 0:
        return jsonify({'error': 'Price cannot be negative'}), 400

    if data.get('quantity', 0) < 0:
        return jsonify({'error': 'Quantity cannot be negative'}), 400

    # check unique SKU
    existing = Product.query.filter_by(sku=data['sku']).first()
    if existing:
        return jsonify({'error': 'SKU already exists'}), 400

    try:
        product = Product(
            name=data['name'],
            sku=data['sku'],
            price=data.get('price', 0),
            quantity=data.get('quantity', 0)
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'price': product.price,
            'quantity': product.quantity,
            'created_at': product.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating product: {e}")
        return jsonify({'error': 'Failed to create product'}), 500


@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    result = []
    for p in products:
        result.append({
            'id': p.id,
            'name': p.name,
            'sku': p.sku,
            'price': p.price,
            'quantity': p.quantity,
            'created_at': p.created_at.isoformat()
        })
    return jsonify(result)


@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify({
        'id': product.id,
        'name': product.name,
        'sku': product.sku,
        'price': product.price,
        'quantity': product.quantity,
        'created_at': product.created_at.isoformat()
    })


@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json()

    if 'price' in data and data['price'] < 0:
        return jsonify({'error': 'Price cannot be negative'}), 400

    if 'quantity' in data and data['quantity'] < 0:
        return jsonify({'error': 'Quantity cannot be negative'}), 400

    # check SKU uniqueness if changing it
    if 'sku' in data and data['sku'] != product.sku:
        existing = Product.query.filter_by(sku=data['sku']).first()
        if existing:
            return jsonify({'error': 'SKU already exists'}), 400

    try:
        product.name = data.get('name', product.name)
        product.sku = data.get('sku', product.sku)
        product.price = data.get('price', product.price)
        product.quantity = data.get('quantity', product.quantity)
        db.session.commit()
        return jsonify({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'price': product.price,
            'quantity': product.quantity,
            'created_at': product.created_at.isoformat()
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product: {e}")
        return jsonify({'error': 'Failed to update product'}), 500


@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product: {e}")
        return jsonify({'error': 'Failed to delete product'}), 500


# ---- CUSTOMER ROUTES ----

@app.route('/api/customers', methods=['POST'])
def create_customer():
    data = request.get_json()

    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400

    # check unique email
    existing = Customer.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'error': 'Email already exists'}), 400

    try:
        customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', '')
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'created_at': customer.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating customer: {e}")
        return jsonify({'error': 'Failed to create customer'}), 500


@app.route('/api/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    result = []
    for c in customers:
        result.append({
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'created_at': c.created_at.isoformat()
        })
    return jsonify(result)


@app.route('/api/customers/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'created_at': customer.created_at.isoformat()
    })


@app.route('/api/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    try:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting customer: {e}")
        return jsonify({'error': 'Failed to delete customer'}), 500


# ---- ORDER ROUTES ----

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    if not data.get('customer_id') or not data.get('items'):
        return jsonify({'error': 'customer_id and items are required'}), 400

    # check customer exists
    customer = Customer.query.get(data['customer_id'])
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    try:
        total = 0
        order_items = []

        for item in data['items']:
            product = Product.query.get(item['product_id'])
            if not product:
                return jsonify({'error': f'Product {item["product_id"]} not found'}), 404

            if product.quantity < item['quantity']:
                return jsonify({'error': f'Insufficient stock for {product.name}. Available: {product.quantity}'}), 400

            # deduct stock
            product.quantity -= item['quantity']

            item_total = item['quantity'] * product.price
            total += item_total

            order_items.append(OrderItem(
                product_id=product.id,
                quantity=item['quantity'],
                price=product.price  # snapshot price
            ))

        order = Order(
            customer_id=data['customer_id'],
            total=total
        )
        order.items = order_items
        db.session.add(order)
        db.session.commit()

        return jsonify({
            'id': order.id,
            'customer_id': order.customer_id,
            'total': order.total,
            'created_at': order.created_at.isoformat(),
            'items': [{
                'id': i.id,
                'product_id': i.product_id,
                'quantity': i.quantity,
                'price': i.price
            } for i in order.items]
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {e}")
        return jsonify({'error': 'Failed to create order'}), 500


@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    result = []
    for o in orders:
        result.append({
            'id': o.id,
            'customer_id': o.customer_id,
            'customer_name': o.customer.name,
            'total': o.total,
            'created_at': o.created_at.isoformat()
        })
    return jsonify(result)


@app.route('/api/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({
        'id': order.id,
        'customer_id': order.customer_id,
        'customer_name': order.customer.name,
        'total': order.total,
        'created_at': order.created_at.isoformat(),
        'items': [{
            'id': i.id,
            'product_id': i.product_id,
            'product_name': i.product.name,
            'quantity': i.quantity,
            'price': i.price
        } for i in order.items]
    })


@app.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    try:
        # restore stock
        for item in order.items:
            product = Product.query.get(item.product_id)
            if product:
                product.quantity += item.quantity

        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted and stock restored'})
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting order: {e}")
        return jsonify({'error': 'Failed to delete order'}), 500


# ---- DASHBOARD ----

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    total_products = Product.query.count()
    total_customers = Customer.query.count()
    total_orders = Order.query.count()

    low_stock = Product.query.filter(Product.quantity < 10).all()
    low_stock_list = [{
        'id': p.id,
        'name': p.name,
        'sku': p.sku,
        'quantity': p.quantity
    } for p in low_stock]

    return jsonify({
        'total_products': total_products,
        'total_customers': total_customers,
        'total_orders': total_orders,
        'low_stock_products': low_stock_list
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
