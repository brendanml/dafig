const express = require('express');
const app = express();
const dotenv = require('dotenv');
const OAuth = require('oauth');
const cors = require('cors');
const path = require('path');
const {User, Listing, Store, Minifig} = require('./models/models');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors())
app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: false,
        sameSite: 'lax',
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
    })
}))


app.get('/temp/:fig_id', async (req, res) => {
    try {
        if (req.session.user) {
            console.log(req.session);
            const listings = await Listing.find({}).populate('store_id').lean();
            return res.json(listings); // Ensure response is returned
        }

        const { fig_id } = req.params;
        console.log("hitting route /temp/:fig_id");

        // Ensure a valid response is sent
        res.status(200).json({ message: "hit", fig_id: fig_id });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/price-guide/:fig_id', async (req, res) => {
    // console.log(req.session)
    // console.log(req.session.user)
                // Helper function to wrap oauth.get in a Promise
    const CON_KEY = process.env.CON_KEY;
    const CON_SEC = process.env.CON_SEC;
    const ACC_TOK = process.env.ACC_TOK;
    const ACC_SEC = process.env.ACC_SEC;
    const oauth = new OAuth.OAuth('', '', CON_KEY, CON_SEC, '1.0', null, 'HMAC-SHA1');
    const fetchData = (url) => {
        return new Promise((resolve, reject) => {
            oauth.get(url, ACC_TOK, ACC_SEC, (error, data) => {
                if (error) {
                    return reject(error);
                }
                try {
                    resolve(JSON.parse(data)); // Parse and resolve data
                } catch (parseError) {
                    reject(parseError); // Reject if parsing fails
                }
            });
        });
    };

    console.log(req.session)
    if(req.session.user) {
        try {
        
            const { fig_id } = req.params
            const country = "CA"
        

            // Use Promise.all to fetch stock and sold data concurrently
            const [stock_data_N, stock_data_U, sold_data_N, sold_data_U, country_stock_data_N, country_stock_data_U, country_sold_data_N, country_sold_data_U, fig_data] = await Promise.all([
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=stock&new_or_used=N`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=stock&new_or_used=U`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=sold&new_or_used=N`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=sold&new_or_used=U`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=stock&country_code=${country}&new_or_used=N`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=stock&country_code=${country}&new_or_used=U`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=sold&country_code=${country}&new_or_used=N`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}/price?guide_type=sold&country_code=${country}&new_or_used=U`),
                fetchData(`https://api.bricklink.com/api/store/v1/items/minifig/${fig_id}`)
            ]);
            
    
            // Send a JSON response after both requests complete
            fig_info = {}
            fig_info['data'] = fig_data.data
            fig_info['stock'] = {new:[], used: []}
            fig_info['sold'] = {new: [], used: []}
            fig_info['stats'] = {}
            fig_info['stats']['country_stock_avg_N'] = country_stock_data_N.data.avg_price
            fig_info['stats']['country_stock_avg_U'] = country_stock_data_U.data.avg_price
            fig_info['stats']['country_sold_avg_N'] = country_sold_data_N.data.avg_price
            fig_info['stats']['country_sold_avg_U'] = country_sold_data_U.data.avg_price
            fig_info['stats']['stock_avg_N'] = stock_data_N.data.avg_price
            fig_info['stats']['stock_avg_U'] = stock_data_U.data.avg_price
            fig_info['stats']['sold_avg_N'] = sold_data_N.data.avg_price
            fig_info['stats']['sold_avg_U'] = sold_data_U.data.avg_price
            fig_info['stats']['country_stock_max_N'] = country_stock_data_N.data.max_price
            fig_info['stats']['country_stock_max_U'] = country_stock_data_U.data.max_price
            fig_info['stats']['country_sold_max_N'] = country_sold_data_N.data.max_price
            fig_info['stats']['country_sold_max_U'] = country_sold_data_U.data.max_price
            fig_info['stats']['stock_max_N'] = stock_data_N.data.max_price
            fig_info['stats']['stock_max_U'] = stock_data_U.data.max_price
            fig_info['stats']['sold_max_N'] = sold_data_N.data.max_price
            fig_info['stats']['sold_max_U'] = sold_data_U.data.max_price
            fig_info['stats']['country_stock_min_N'] = country_stock_data_N.data.min_price
            fig_info['stats']['country_stock_min_U'] = country_stock_data_U.data.min_price
            fig_info['stats']['country_sold_min_N'] = country_sold_data_N.data.min_price
            fig_info['stats']['country_sold_min_U'] = country_sold_data_U.data.min_price
            fig_info['stats']['stock_min_N'] = stock_data_N.data.min_price
            fig_info['stats']['stock_min_U'] = stock_data_U.data.min_price
            fig_info['stats']['sold_min_N'] = sold_data_N.data.min_price
            fig_info['stats']['sold_min_U'] = sold_data_U.data.min_price
    
    
            for(let i = 0; i<sold_data_N.data.price_detail.length; i++){
                sold = {}
                sold['condition'] = sold_data_N.data.new_or_used
                sold['date'] = sold_data_N.data.price_detail[i].date_ordered.slice(0,10)
                sold['price'] = sold_data_N.data.price_detail[i].unit_price
                sold['buyer_country'] = sold_data_N.data.price_detail[i].buyer_country_code
                sold['seller_country'] = sold_data_N.data.price_detail[i].seller_country_code
                fig_info['sold']['new'].push(sold)
            }
            for(let i = 0; i<sold_data_U.data.price_detail.length; i++){
                sold = {}
                sold['condition'] = sold_data_U.data.new_or_used
                sold['date'] = sold_data_U.data.price_detail[i].date_ordered.slice(0,10)
                sold['price'] = sold_data_U.data.price_detail[i].unit_price
                sold['buyer_country'] = sold_data_U.data.price_detail[i].buyer_country_code
                sold['seller_country'] = sold_data_U.data.price_detail[i].seller_country_code
                fig_info['sold']['used'].push(sold)
            }
            for(let i = 0; i<stock_data_N.data.price_detail.length; i++){
                stock = {}
                stock['condition'] = stock_data_N.data.new_or_used
                stock['price'] = stock_data_N.data.price_detail[i].unit_price
                fig_info['stock']['new'].push(stock)
            }
            for(let i = 0; i<stock_data_U.data.price_detail.length; i++){
                stock = {}
                stock['condition'] = stock_data_U.data.new_or_used
                stock['price'] = stock_data_U.data.price_detail[i].unit_price
                fig_info['stock']['used'].push(stock)
            }
            for(let i = 0; i<country_sold_data_N.data.price_detail.length; i++){
                sold = {}
                sold['condition'] = country_sold_data_N.data.new_or_used
                sold['date'] = country_sold_data_N.data.price_detail[i].date_ordered.slice(0,10)
                sold['price'] = country_sold_data_N.data.price_detail[i].unit_price
                sold['buyer_country'] = country_sold_data_N.data.price_detail[i].buyer_country_code
                sold['seller_country'] = country_sold_data_N.data.price_detail[i].seller_country_code
                fig_info['sold']['new'].push(sold)
            }
            for(let i = 0; i<country_sold_data_U.data.price_detail.length; i++){
                sold = {}
                sold['condition'] = country_sold_data_U.data.new_or_used
                sold['date'] = country_sold_data_U.data.price_detail[i].date_ordered.slice(0,10)
                sold['price'] = country_sold_data_U.data.price_detail[i].unit_price
                sold['buyer_country'] = country_sold_data_U.data.price_detail[i].buyer_country_code
                sold['seller_country'] = country_sold_data_U.data.price_detail[i].seller_country_code
                fig_info['sold']['used'].push(sold)
            }
            for(let i = 0; i<country_stock_data_N.data.price_detail.length; i++){
                stock = {}
                stock['condition'] = country_stock_data_N.data.new_or_used
                stock['price'] = country_stock_data_N.data.price_detail[i].unit_price
                fig_info['stock']['new'].push(stock)
            }
            for(let i = 0; i<country_stock_data_U.data.price_detail.length; i++){
                stock = {}
                stock['condition'] = country_stock_data_U.data.new_or_used
                stock['price'] = country_stock_data_U.data.price_detail[i].unit_price
                fig_info['stock']['used'].push(stock)
            }
            res.json(fig_info);
        } catch (error) {
            console.error('Error fetching data:', error.message || error);
            // Send a meaningful error response
            res.status(500).json({ error: 'Failed to fetch data from BrickLink API' });
        }
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }

});

app.post('/register', async (req, res) => {
    console.log("hitting /register...")
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({ error: 'Username or password field invalid' });
    }
    try {
        console.log("hashing password...")
        const hashed_password = await bcrypt.hash(password, 10);
        console.log(hashed_password)
        const newUser = new User({
            username : String(username),
            password : String(hashed_password)
        })
        await newUser.save()
        res.json({ message: 'User created successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to save user' });
    }

})

app.post('/login', async (req, res) => {
    console.log("hitting /login...")
    const { username, password } = req.body;
    const user = await User.findOne({username})
    const isMatch = await bcrypt.compare(password, user.password)
    if(isMatch){
        console.log("User logged in successfully! thre is match")
        req.session.user = {id: user._id, username: user.username};
        res.json({ message: 'User logged in successfully' });
        console.log(req.session.user)
    } else {
        res.status(400).json({ error: 'Invalid username or password' });
    }
})

app.get('/items', (req, res) => {
    const filePath = path.join(__dirname, "swFigs.json");
    const items = require(filePath); // Assuming this is an array
    res.json(items); // Ensure the response is an array
  });
  
app.get('/login', (req, res) => {
    res.send("working")
});

app.get('/user', (req, res) => {
    if(req.session.user) {
        res.json(req.session.user.username)
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
})

app.post('/delete-all' , async (req, res) => {
    if(req.session.user.username !== 'admin') {
        return res.status(401).json({ error: 'Not authorized' });
    } else {
        await User.deleteMany({username: {$ne: 'admin'}});
        res.json({ message: 'Database cleared' });
    }
})


const PORT = process.env.PORT || 5501;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
