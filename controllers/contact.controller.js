const validation = require('../validation/data.validation')
const createError = require(`http-errors`)
const db = require('../model')
const Contact = db.contact

exports.saveContact = async (req, res, next) => {
  try {
      const validatedResult = await validation.contact().validateAsync(req.body, { abortEarly: false })

        const { name, address } = validatedResult;
        const contactDetails = {name,address,userId:res.locals.payload.sub.id}
    const result = await Contact.create(contactDetails);
    if (!result) {
      throw createError(500, "can not saveContact");
    }
        console.log("saving contact", result);

        return res.status(201).json({status: 'success',message: "contact successfully saved" });

    }
    catch (err) {
        next(err);
    }
}

exports.getUserContactsCount
 = async (req, res, next) => {
  try {
    const data = {};
      const id = req.query.id
      const userContact = await Contact.count({ userId: id })
      data.userContact = userContact
      return res.status(200).json({ status: 'success', data: data })
    
    
  } catch (err) {
   next(err);
  }
}


exports.getSingleContactDetail = async (req, res, next) => {
  try {
    
    const userId = res.locals.payload.sub.id;
    const contactId = req.query.contactId;
    console.log('params', contactId)


    const result = await Contact.findOne({
      Where: {"id": contactId,
        "userId": userId
       
      }
    });
    console.log('result', result);
    return res.status(200).json({status:"success",data:result});

  }
  catch (err) {
    next(err);
  }
}

exports.getUserContacts = async (req, res, next) => {
  try {
    const id = res.locals.payload.sub.id;
    const response = await Contact.findAll({ Where: { userId: id },limit:5,offset:0 });
    console.log(response);
    res.status(200).json({status:"success",data:response});

  }
  catch (err) {
    next(err);
  }
}

exports.updateContact = async (req, res, next) => {
  try {
    const dataToUpdate = {};
    const contactId = req.body.contactId;
    const id = res.locals.payload.sub.id;

    if (req.body.name) {
      dataToUpdate.name = req.body.name;
    }
    if (req.body.address) {
      dataToUpdate.address= req.body.address;
    }


    const response = await Contact.update(dataToUpdate,{where:{userId:id, id:contactId}})
    console.log("response", response);
    return res.status(200).json({ status: 'success', data: response })
  }
  catch (err) {
    next(err);
  }
}

exports.deleteUserContact = async (req, res, next) => {
  try {
    const contactId = req.body.contactId;
    const userId = String(res.locals.payload.sub.id);

    const result = await Contact.destroy({ where: { userId: userId, id: contactId, } });
    res.status(200).json({ status: 'success',message: "successfully deleted contact" });
  }
  catch (err) {
    next(err);
  }

}

exports.addContactBulk = async (req, res, next) => {
  try {
    const bulkContacts = req.body.contacts;
    const id = res.locals.payload.sub.id;
    const data = bulkContacts.map(element => ({
      ...element,
      userId: id
    }));
console.log(data)

    const result = await Contact.bulkCreate(data);
    console.log("result", result);
    res.status(201).json({status:"success",message:"contacts successfully inserted"})
  }
  catch (err) {
    console.log("err", err);
    next(err);
  }
}