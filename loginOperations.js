const sql = require('mssql');

var webconfig = {
  user: 'batuhan61',
  password: 'batuhan28',
  server: '192.168.2.165',
  database: 'bitirmeProjesi'
};

// module.exports.userUyeOl = function(req, res) {
//   sql.connect(webconfig, function(err) {
//     if (err) console.log(err);
//     var request1 = new sql.Request();
//     request1.query(
//       "INSERT INTO Uye(Adi,Soyadi,Sifre,Email,KullaniciAdi) VALUES('" +
//         req.body.uye_Adi +
//         "','" +
//         req.body.uye_Soyadi +
//         "','" +
//         req.body.uye_Sifre +
//         "','" +
//         req.body.uye_EMail +
//         "','" +
//         req.body.uye_kullanici_Adi +
//         "')",
//       function(err, data) {
//         if (err) {
//           console.log(err);
//         }
//         sql.close();
//         res.render('oturumac');
//       }
//     );
//   });
// };

module.exports.userUyeOl = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_UyeKontrol ('" + req.body.uye_kullanici_Adi + "','" + req.body.uye_EMail + "') as varmi", function(err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Kullanıcı adı bulunmaktadır ' });
          sql.close();
        } else {
          request1.query(
            "INSERT INTO Uye(Adi,Soyadi,Sifre,Email,KullaniciAdi)  VALUES('" +
              req.body.uye_Adi +
              "','" +
              req.body.uye_Soyadi +
              "','" +
              req.body.uye_Sifre +
              "','" +
              req.body.uye_EMail +
              "','" +
              req.body.uye_kullanici_Adi +
              "')",
            function(err, data) {
              if (err) {
                console.log(err);
              }
              res.render('oturumac', { hata: '' });
              sql.close();
            }
          );
        }
      });
    });
  });
};

module.exports.UyeOl = function(req, res) {
  res.render('oturumac', { hata: '' });
};

module.exports.kullaniciGiris = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_UyeVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function(kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Uye where KullaniciAdi='" + req.body.ad + "'", function(err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }
            sql.close();
            res.render('Anasayfa', { veri: data.recordset });
          });
        } else {
          res.render('Login', { hata: 'Kullanıcı adı veya sifre hatalı' });
          sql.close();
        }
      });
    });
  });
};

module.exports.KullaniciLogin = function(req, res) {
  res.render('Login', { hata: '' });
};
