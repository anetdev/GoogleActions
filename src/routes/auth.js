const express = require('express');
const router = express.Router();

router.get('/authoriz', (request, response) => {
    const redirectUri = request.query.redirect_uri;
    console.log("redirectUri -->" + redirectUri);
    console.log("request.query.state -->" + request.query.state);
    response.status(200).send(`<a href="${decodeURIComponent(redirectUri)}?code=placeholder-auth-code&state=${request.query.state}">Complete Account Linking</a>`);

});
router.post('/token', (request, response) => {
    console.log("token get");
    response.status(200).send({
        token_type: 'bearer',
        access_token: 'placeholder-access-token',
        refresh_token: 'placeholder-refresh-token',
        expires_in: 3600,
    });
});
module.exports = router;