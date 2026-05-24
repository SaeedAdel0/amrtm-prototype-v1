// Shared interactions for AmrTM prototype
(function(){
  // Utilities - validation rules
  const regexName = /^[\p{L} ]{3,}$/u;
  const regexPhone = /^\d{5,}$/;
  const regexLicense = /^\d+$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValidName(v){return regexName.test(v.trim())}
  function isValidPhone(v){return regexPhone.test(v.trim())}
  function isValidLicense(v){return regexLicense.test(v.trim())}
  function isValidEmail(v){return regexEmail.test(v.trim())}

  // Modal system
  const backdrop = document.createElement('div');
  backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <strong class="modal-title">Title</strong>
        <button class="btn close-modal text-on-surface-variant hover:text-primary" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer"></div>
    </div>`;
  document.body.appendChild(backdrop);
  
  const modal = backdrop.querySelector('.modal');
  const modalTitle = backdrop.querySelector('.modal-title');
  const modalBody = backdrop.querySelector('.modal-body');
  const modalFooter = backdrop.querySelector('.modal-footer');
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) closeModal(); });
  backdrop.querySelector('.close-modal').addEventListener('click', closeModal);
  
  function openModal({title='', body='', footer=''}){
    modalTitle.textContent = title;
    modalBody.innerHTML = body||'';
    modalFooter.innerHTML = footer||'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>';
    backdrop.classList.add('show');
    backdrop.querySelectorAll('.close-modal').forEach(b=>b.addEventListener('click', closeModal));
  }
  function closeModal(){ backdrop.classList.remove('show'); }
  window.AmrTM = { openModal, closeModal, validators:{isValidName,isValidPhone,isValidLicense,isValidEmail} };

  // Floating nav (FAB)
  const fab = document.createElement('button');
  fab.className='fab';
  fab.title='Navigation';
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="white" opacity="0.06"/><path d="M12 7V17M7 12H17" stroke="#111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(fab);
  fab.addEventListener('click', ()=>{
    openModal({
      title:'التنقل بين الصفحات',
      body:`<div style="display:flex;flex-direction:column;gap:10px">
        <a class="bg-primary text-white text-center py-2 rounded-xl hover:bg-opacity-90" href="Profile.html">بروفايل الاستشاري</a>
        <a class="bg-primary text-white text-center py-2 rounded-xl hover:bg-opacity-90" href="Homepage.html">الصفحة الرئيسية</a>
        <a class="bg-primary text-white text-center py-2 rounded-xl hover:bg-opacity-90" href="Dashboard.html">لوحة التسجيل</a>
      </div>`,
      footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>'
    });
  });

  // Page specific wiring
  function wireProfile(){
    const hero = document.querySelector('main section');
    if(hero){
      const wrap = document.createElement('div'); wrap.style.marginTop='12px'; wrap.style.display='flex'; wrap.style.justifyContent='center'; wrap.style.gap='12px';
      const contact = document.createElement('button'); contact.className='bg-surface border border-gray-200 px-4 py-2 rounded-xl text-primary font-bold hover:bg-gray-50'; contact.textContent='تواصل معنا';
      const book = document.createElement('button'); book.className='bg-[#D6B56E] text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-[#c5a45d]'; book.textContent='احجز استشارتك';
      wrap.appendChild(contact); wrap.appendChild(book); hero.appendChild(wrap);
      
      contact.addEventListener('click', ()=>{
        openModal({title:'تواصل معنا', body:`<div class="flex flex-col gap-3"><label>الاسم</label><input id="contact_name" class="input" placeholder="الاسم الكامل" /><div id="contact_name_err" class="error"></div><label>البريد الإلكتروني</label><input id="contact_email" class="input" placeholder="you@example.com" /><div id="contact_email_err" class="error"></div><label>الرسالة</label><textarea id="contact_message" class="input" rows="4" placeholder="كيف يمكننا مساعدتك؟"></textarea><div id="contact_msg_err" class="error"></div></div>`, footer:`<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إلغاء</button><button class="bg-primary text-white px-4 py-2 rounded-xl" id="contact_send">إرسال</button>`});
        setTimeout(()=>{
          const send = document.getElementById('contact_send');
          send.addEventListener('click', ()=>{
            const n = document.getElementById('contact_name'); const e = document.getElementById('contact_email'); const m = document.getElementById('contact_message');
            let ok=true; document.getElementById('contact_name_err').textContent=''; document.getElementById('contact_email_err').textContent=''; document.getElementById('contact_msg_err').textContent='';
            if(!isValidName(n.value)){ document.getElementById('contact_name_err').textContent='أدخل اسماً صحيحاً (أحرف فقط، 3 أحرف كحد أدنى)'; ok=false}
            if(!isValidEmail(e.value)){ document.getElementById('contact_email_err').textContent='أدخل بريد إلكتروني صحيح'; ok=false}
            if(!m.value.trim()){ document.getElementById('contact_msg_err').textContent='الرسالة لا يمكن أن تكون فارغة'; ok=false}
            if(ok){ closeModal(); openModal({title:'تم الإرسال', body:'تم إرسال رسالتك بنجاح (محاكاة).', footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>'}); }
          });
        },30);
      });

      book.addEventListener('click', ()=>{
        openModal({title:'حجز استشارة', body:`<div class="flex flex-col gap-3"><label>الاسم</label><input id="book_name" class="input" placeholder="الاسم الكامل" /><div id="book_name_err" class="error"></div><label>الهاتف</label><input id="book_phone" class="input" placeholder="0501234567" /><div id="book_phone_err" class="error"></div><label>البريد الإلكتروني</label><input id="book_email" class="input" placeholder="you@example.com" /><div id="book_email_err" class="error"></div></div>`, footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إلغاء</button><button class="bg-primary text-white px-4 py-2 rounded-xl" id="book_send">تأكيد الحجز</button>'});
        setTimeout(()=>{
          document.getElementById('book_send').addEventListener('click', ()=>{
            const n=document.getElementById('book_name'), p=document.getElementById('book_phone'), e=document.getElementById('book_email');
            let ok=true; ['book_name_err','book_phone_err','book_email_err'].forEach(id=>document.getElementById(id).textContent='');
            if(!isValidName(n.value)){ document.getElementById('book_name_err').textContent='الاسم مطلوب'; ok=false }
            if(!isValidPhone(p.value)){ document.getElementById('book_phone_err').textContent='رقم الهاتف غير صحيح (أرقام فقط)'; ok=false }
            if(!isValidEmail(e.value)){ document.getElementById('book_email_err').textContent='بريد إلكتروني غير صحيح'; ok=false }
            if(ok){ closeModal(); openModal({title:'تم الحجز', body:'تم حجز الاستشارة بنجاح (محاكاة).', footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>'}); }
          });
        },30);
      });
    }

    // Star interactivity
    document.querySelectorAll('.star-rating').forEach(container=>{
      const stars = Array.from(container.querySelectorAll('.material-symbols-outlined'));
      stars.forEach((s,i)=>{
        s.classList.add('star');
        s.style.cursor = 'pointer';
        s.addEventListener('mouseenter', ()=>{ for(let k=0;k<=i;k++) { stars[k].classList.add('hovered'); stars[k].style.fontVariationSettings = "'FILL' 1"; }});
        s.addEventListener('mouseleave', ()=>{ stars.forEach((x, idx)=>{ x.classList.remove('hovered'); if(!x.classList.contains('selected')) x.style.fontVariationSettings = "'FILL' 0"; });});
        s.addEventListener('click', ()=>{ 
            stars.forEach(x=>{ x.classList.remove('selected'); x.style.fontVariationSettings = "'FILL' 0"; }); 
            for(let k=0;k<=i;k++){ stars[k].classList.add('selected'); stars[k].style.fontVariationSettings = "'FILL' 1"; }
        });
      });
    });
  }

  function wireHomepage(){
    document.querySelectorAll('.grid .rounded-xl, .consultant-cards .group').forEach(card=>{
      card.style.cursor='pointer';
      card.addEventListener('click', (e)=>{
        if(e.target.closest('button')||e.target.closest('a')) return;
        window.location.href='Profile.html';
      });
    });
    document.querySelectorAll('span.material-symbols-outlined').forEach(el=>{
      if(el.textContent.trim()==='search') el.addEventListener('click', ()=>{
        openModal({title:'بحث متقدم', body:`<div class="flex flex-col gap-4"><div><label class="block mb-2">التخصص</label><select class="input" id="adv_spec"><option value="">الكل</option><option>استراتيجية الأعمال</option><option>المالية</option><option>القيادة</option></select></div><div><label class="block mb-2">أقصى سعر (ر.س)</label><input id="adv_price" class="input" placeholder="مثال: 1000" /></div></div>`, footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إلغاء</button><button class="bg-primary text-white px-4 py-2 rounded-xl" id="adv_apply">تطبيق</button>'});
        setTimeout(()=>{document.getElementById('adv_apply').addEventListener('click', ()=>{ closeModal(); openModal({title:'تم التطبيق', body:'تم تطبيق عوامل التصفية (محاكاة).', footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>'}); });},20);
      });
    });
  }

  function wireDashboard(){
    const navLinks = document.querySelectorAll('nav a');
    
    // Side nav wiring: show/hide main sections
    navLinks.forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault(); const txt=a.textContent.trim();
        const sections = { 'لوحة التحكم': 'both', 'حسابي':'form', 'مواعيدي':'schedule', 'التوفر':'schedule', 'التقارير':'reports' };
        const show = sections[txt]||'both';
        const formEl = document.querySelector('form');
        const schedEl = document.querySelectorAll('.glass-panel')[1] || document.querySelectorAll('section')[1];
        if(formEl) formEl.parentElement.style.display = (show==='form' || show==='both')? 'block':'none';
        if(schedEl) schedEl.style.display = (show==='schedule' || show==='both')? 'block':'none';
        
        let rpt = document.getElementById('reports_dummy');
        if(show==='reports'){
          if(!rpt){ 
              rpt = document.createElement('div'); 
              rpt.id='reports_dummy'; 
              rpt.className='bg-surface border border-border shadow-sm rounded-xl p-6 md:p-8 mb-8 mt-8'; 
              rpt.innerHTML='<h2 class="font-bold text-primary text-xl mb-4">التقارير (محاكاة)</h2><p class="text-on-surface-variant">ستظهر تقارير الأداء والمبيعات هنا.</p>'; 
              document.querySelector('main').appendChild(rpt); 
          }
          rpt.style.display='block';
        } else if(rpt) {
            rpt.style.display='none';
        }
      });
    });

    // Registration form validation on Save
    const saveBtn = document.querySelector('button.bg-primary') || document.querySelector('button[type="submit"]');
    if(saveBtn){
      saveBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        const name = document.querySelector('input[placeholder="الاسم"]');
        const phone = document.querySelector('input[type="tel"]') || document.querySelector('input[placeholder="رقم الهاتف"]');
        const email = document.querySelector('input[type="email"]') || document.querySelector('input[placeholder="البريد الإلكتروني"]');
        const license = Array.from(document.querySelectorAll('input[type="text"]')).find(i=>i.placeholder.includes('الترخيص')||i.placeholder.includes('license') );
        const bio = document.querySelector('textarea');
        let ok=true; let msgs=[];
        if(!name || !isValidName(name.value)){ ok=false; msgs.push('الاسم غير صحيح (يجب أن يحتوي على أحرف فقط)'); }
        if(!phone || !isValidPhone(phone.value)){ ok=false; msgs.push('رقم الهاتف غير صحيح'); }
        if(!email || !isValidEmail(email.value)){ ok=false; msgs.push('البريد الإلكتروني غير صحيح'); }
        if(!license || !isValidLicense(license.value)){ ok=false; msgs.push('رقم الترخيص غير صحيح (أرقام فقط)'); }
        if(!bio || !bio.value.trim()){ ok=false; msgs.push('النبذة المختصرة مطلوبة'); }
        if(!ok){ openModal({title:'فشل التحقق', body:`<ul style="list-style:disc; padding-right:20px;">${msgs.map(m=>`<li>${m}</li>`).join('')}</ul>`, footer:'<button class="bg-gray-200 px-4 py-2 rounded-xl close-modal">إغلاق</button>'}); }
        else{ openModal({title:'تم الحفظ', body:'تم حفظ المعلومات بنجاح (محاكاة).', footer:'<button class="bg-primary text-white px-4 py-2 rounded-xl close-modal">إغلاق</button>'}); }
      });
    }

    // Schedule slot toggle (تفعيل الأيام المحددة لتصبح زرقاء مباشرة بدون نافذة منبثقة)
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.addEventListener('click', function() {
        // التبديل بين التحديد والإلغاء (إضافة كلاس selected)
        this.classList.toggle('selected');
        
        // إزالة الشفافية (opacity-50) إذا كانت موجودة وتم تحديد المربع
        if(this.classList.contains('selected')) {
            this.classList.remove('opacity-50');
        }
      });
    });
  }

  // Initialize per page by title detection
  document.addEventListener('DOMContentLoaded', ()=>{
    const t = document.title || '';
    if(/الملف الشخصي|Profile/.test(t) || document.querySelector('.star-rating')) wireProfile();
    if(/اختر مجال|Choose|AmrTM/.test(t) || /اختر/.test(t) || /الصفحة الرئيسية/.test(t)) wireHomepage();
    if(/Dashboard|لوحة التحكم|تسجيل المستشار/.test(t) || document.querySelector('form')) wireDashboard();
  });
})();