const Medicine = require("../models/medicineModel");
const randomString = require("randomstring");

exports.showMedicines = async (req,res)=>{
  try {
    const medicines = await Medicine.find()
    return res.render('admin/medicines/Medicines',{medicines})
  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
}

exports.ShowAddMedicine = async (req, res) => {
  try {
    res.render("admin/medicines/AddMedicine", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
};

exports.addMedicine = async (req, res) => {
  const { name, brand, batch, expiry, stock } = req.body;
  function generateSlno() {
    let UniqueNum = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    return Medicine.findOne({ Slno: UniqueNum }).then((existing) => {
      if (existing) {
        return generateSlno(); // If the code is not unique, generate a new one recursively
      }
      return UniqueNum;
    });
  }

  try {
    let num = await generateSlno();
    const medicine = new Medicine({
      Slno: num,
      name,
      brand,
      batch,
      expiry,
      stock,
    });
    await medicine.save();
    return res.redirect("/admin/medicines");
  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
};


exports.showEditMed = async (req,res)=>{
  try {
     const id = req.params.id
     const medicine = await Medicine.findById(id)
     return res.render('admin/medicines/EditMedicine',{medicine,message:null,error:null})
  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
}


exports.updateMedicine = async (req,res)=>{
  const { id,name, brand, batch, expiry, stock } = req.body;
  try {
     const medicine = await Medicine.findById(id)     
     await Medicine.findByIdAndUpdate(id,{$set:{
       Slno:medicine.Slno,
       name,
       brand,
       batch,
       expiry,
       stock
     }},{new:true})
     return res.redirect('/admin/medicines')

  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
}

exports.deleteMedicine = async (req,res)=>{
  const id = req.params.id
  try {
    await Medicine.findByIdAndDelete(id)
    res.redirect('/admin/medicines')
  } catch (error) {
    console.log(error.message);
    res.send("internal Server error");
  }
}


exports.searchMedicine=async (req,res)=>{
  const { q } = req.body
  try {
      let medicines;
      if (q) {
        medicines = await Medicine.find({ name: { $regex: '.*' + q + '.*' }})
      }else{
        medicines = await Medicine.find()
      }
      res.render('admin/medicines/Medicines',{medicines, message:null, error:null})
  } catch (error) {
      console.log(error.message)
  }
}