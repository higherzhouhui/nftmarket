module.exports = {
	  devServer: {
	    proxy: {
	     '/nftMarket': {
	             target: 'https://app.nftmarket.life',
	             changeOrigin: true, 
	                 pathRewrite: {
	                 "^/nftMarket": ""
	            }
	        }
	    }
	}
}