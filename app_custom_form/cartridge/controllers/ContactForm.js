'use strict';
​
var server = require('server');
​
server.get('Landing', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var contactForm = server.forms.getForm('contactBr');
    res.render('/contactBr/contactBr', {
        actionUrl: URLUtils.url('ContactForm-Subscribe').toString(),
        contactForm: contactForm
    });
    next();
});
​
server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var contactForm = server.forms.getForm('contactBr');
    var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');
    var myForm = req.form;
    var customObjMgr = require('dw/object/CustomObjectMgr');
    var txn = require('dw/system/Transaction');
    txn.begin();
    try{
        var newSubscribe = customObjMgr.createCustomObject('CadastroForn_dae', contactForm.email.value);
        newSubscribe.custom.Email = contactForm.email.value;
        newSubscribe.custom.Name = contactForm.name.value;
        newSubscribe.custom.Phone = contactForm.phone.value;
        newSubscribe.custom.Message = contactForm.message.value;
        newSubscribe.custom.Cnpj = contactForm.cnpj.value;
        var contactDetails = [myForm.name, myForm.email, myForm.phone, myForm.message, myForm.cnpj];
        res.render('/contactBr/mensagemSucess', {
            contactForm: contactForm
        });
    }catch(e) {
        //Oops!
        txn.rollback();
       }
    next();
});
module.exports = server.exports();