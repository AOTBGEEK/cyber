# 🚀 دليل النشر على GitHub و GitHub Pages

## الخطوة 1: إنشاء Repository على GitHub

### الطريقة الأولى: عبر موقع GitHub
1. اذهب إلى [GitHub.com](https://github.com)
2. سجل دخولك أو أنشئ حساب جديد
3. اضغط على زر **"New repository"** الأخضر
4. املأ البيانات التالية:
   - **Repository name**: `cybersecurity-workshop`
   - **Description**: `ورشة المهندس المستقبلي - الأمن السيبراني والذكاء الاصطناعي`
   - اختر **Public** (لتفعيل GitHub Pages مجاناً)
   - **لا تضع** علامة على "Add a README file" (لدينا README جاهز)
5. اضغط **"Create repository"**

### الطريقة الثانية: باستخدام GitHub CLI (إذا كان مثبت)
```bash
gh repo create cybersecurity-workshop --public --description "ورشة المهندس المستقبلي - الأمن السيبراني والذكاء الاصطناعي"
```

## الخطوة 2: ربط المشروع المحلي بـ GitHub

في Terminal، تأكد أنك في مجلد `cybersecurity-workshop` ثم نفذ:

```bash
# إضافة رابط GitHub repository
git remote add origin https://github.com/[اسم_المستخدم]/cybersecurity-workshop.git

# رفع الكود إلى GitHub
git branch -M main
git push -u origin main
```

**مثال**: إذا كان اسم المستخدم `engaotb`:
```bash
git remote add origin https://github.com/engaotb/cybersecurity-workshop.git
git branch -M main
git push -u origin main
```

## الخطوة 3: تفعيل GitHub Pages

1. اذهب إلى repository على GitHub
2. اضغط على تبويب **"Settings"**
3. انزل إلى قسم **"Pages"** في القائمة الجانبية
4. في قسم **"Source"**:
   - اختر **"Deploy from a branch"**
   - اختر **"main"** branch
   - اختر **"/ (root)"** folder
5. اضغط **"Save"**

## الخطوة 4: الوصول للموقع

بعد بضع دقائق، سيكون الموقع متاحاً على:
```
https://[اسم_المستخدم].github.io/cybersecurity-workshop/
```

**مثال**: `https://engaotb.github.io/cybersecurity-workshop/`

## 🔧 أوامر Git المفيدة

### تحديث الموقع بعد التعديل
```bash
git add .
git commit -m "وصف التحديث"
git push origin main
```

### التحقق من حالة Git
```bash
git status
git log --oneline
```

### إضافة ملفات جديدة
```bash
git add filename.html
git commit -m "إضافة ملف جديد"
git push origin main
```

## ⚠️ مشاكل شائعة وحلولها

### مشكلة: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/[اسم_المستخدم]/cybersecurity-workshop.git
```

### مشكلة: "Permission denied"
- تأكد من صحة اسم المستخدم وكلمة المرور
- أو استخدم Personal Access Token بدلاً من كلمة المرور

### مشكلة: الموقع لا يظهر على GitHub Pages
- تأكد من أن Repository هو Public
- انتظر 5-10 دقائق بعد التفعيل
- تحقق من وجود ملف `index.html` في المجلد الرئيسي

## 📱 اختبار الموقع

بعد النشر، تأكد من:
- [ ] الصفحة الرئيسية تعمل
- [ ] الروابط تعمل بشكل صحيح
- [ ] الصور والملفات تظهر
- [ ] التصميم يظهر بشكل صحيح
- [ ] المختبرات تعمل تفاعلياً

## 🔄 التحديثات التلقائية

كلما قمت برفع تحديث جديد إلى GitHub، سيتم تحديث الموقع تلقائياً خلال دقائق معدودة.

## 📊 إحصائيات GitHub Pages

يمكنك مراقبة:
- عدد الزوار
- الصفحات الأكثر زيارة
- مصادر الزيارات

من خلال إعدادات Repository > Insights > Traffic

---

## 🎉 تهانينا!

الآن لديك موقع تعليمي احترافي منشور على الإنترنت ومتاح للجميع!

**رابط مشاركة**: `https://[اسم_المستخدم].github.io/cybersecurity-workshop/` 