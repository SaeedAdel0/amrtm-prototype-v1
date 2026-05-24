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
      <div class="modal-header"><strong class="modal-title">Title</strong><button class="btn close-modal">✕</button></div>
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
    modalFooter.innerHTML = footer||'<button class="btn close-modal">Close</button>';
    backdrop.classList.add('show');
    // wire close buttons inside footer
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
        <a class="btn primary" href="Profile.html">بروفايل الاستشاري</a>
        <a class="btn primary" href="Homepage.html">الصفحة الرئيسية</a>
        <a class="btn primary" href="Dashboard.html">لوحة التسجيل</a>
      </div>`,
      footer:'<button class="btn close-modal">إغلاق</button>'
    });
  });

  // Page specific wiring
  function wireProfile(){
    // Add Contact & Book buttons dynamically near top of page
    const hero = document.querySelector('main section');
    if(hero){
      const wrap = document.createElement('div'); wrap.style.marginTop='12px'; wrap.style.display='flex'; wrap.style.justifyContent='center'; wrap.style.gap='12px';
      const contact = document.createElement('button'); contact.className='btn'; contact.textContent='Contact Us';
      const book = document.createElement('button'); book.className='btn primary'; book.textContent='Book Consultation';
      wrap.appendChild(contact); wrap.appendChild(book); hero.appendChild(wrap);
      contact.addEventListener('click', ()=>{
        openModal({title:'Contact Us', body:`<div><label>Name</label><input id="contact_name" class="input" placeholder="Full name" /><div id="contact_name_err" class="error"></div><label style="margin-top:8px">Email</label><input id="contact_email" class="input" placeholder="you@example.com" /><div id="contact_email_err" class="error"></div><label style="margin-top:8px">Message</label><textarea id="contact_message" class="input" rows="4" placeholder="How can we help?"></textarea><div id="contact_msg_err" class="error"></div></div>`, footer:`<button class="btn close-modal">Cancel</button><button class="btn primary" id="contact_send">Send</button>`});
        setTimeout(()=>{
          const send = document.getElementById('contact_send');
          send.addEventListener('click', ()=>{
            const n = document.getElementById('contact_name'); const e = document.getElementById('contact_email'); const m = document.getElementById('contact_message');
            let ok=true; document.getElementById('contact_name_err').textContent=''; document.getElementById('contact_email_err').textContent=''; document.getElementById('contact_msg_err').textContent='';
            if(!isValidName(n.value)){ document.getElementById('contact_name_err').textContent='Enter a valid name (letters only, min 3 chars)'; ok=false}
            if(!isValidEmail(e.value)){ document.getElementById('contact_email_err').textContent='Enter a valid email'; ok=false}
            if(!m.value.trim()){ document.getElementById('contact_msg_err').textContent='Message cannot be empty'; ok=false}
            if(ok){ closeModal(); openModal({title:'Sent', body:'Your message was sent (mock).', footer:'<button class="btn close-modal">Close</button>'}); }
          });
        },30);
      });
      book.addEventListener('click', ()=>{
        openModal({title:'Book Consultation', body:`<div><label>Name</label><input id="book_name" class="input" placeholder="Full name" /><div id="book_name_err" class="error"></div><label style="margin-top:8px">Phone</label><input id="book_phone" class="input" placeholder="0501234567" /><div id="book_phone_err" class="error"></div><label style="margin-top:8px">Email</label><input id="book_email" class="input" placeholder="you@example.com" /><div id="book_email_err" class="error"></div></div>`, footer:'<button class="btn close-modal">Cancel</button><button class="btn primary" id="book_send">Confirm</button>'});
        setTimeout(()=>{
          document.getElementById('book_send').addEventListener('click', ()=>{
            const n=document.getElementById('book_name'), p=document.getElementById('book_phone'), e=document.getElementById('book_email');
            let ok=true; ['book_name_err','book_phone_err','book_email_err'].forEach(id=>document.getElementById(id).textContent='');
            if(!isValidName(n.value)){ document.getElementById('book_name_err').textContent='Valid name required'; ok=false }
            if(!isValidPhone(p.value)){ document.getElementById('book_phone_err').textContent='Valid phone (numbers only)'; ok=false }
            if(!isValidEmail(e.value)){ document.getElementById('book_email_err').textContent='Valid email'; ok=false }
            if(ok){ closeModal(); openModal({title:'Booked', body:'Consultation booked (mock).', footer:'<button class="btn close-modal">Close</button>'}); }
          });
        },30);
      });
    }

    // Star interactivity
    document.querySelectorAll('.star-rating').forEach(container=>{
      const stars = Array.from(container.querySelectorAll('.material-symbols-outlined'));
      stars.forEach((s,i)=>{
        s.classList.add('star');
        s.addEventListener('mouseenter', ()=>{ for(let k=0;k<=i;k++) stars[k].classList.add('hovered');});
        s.addEventListener('mouseleave', ()=>{ stars.forEach(x=>x.classList.remove('hovered'));});
        s.addEventListener('click', ()=>{ stars.forEach((x,idx)=> x.classList.toggle('hovered', idx<=i)); });
      });
    });
  }

  function wireHomepage(){
    // Make consultant cards clickable to view profile
    document.querySelectorAll('.grid .rounded-xl').forEach(card=>{
      card.style.cursor='pointer';
      card.addEventListener('click', (e)=>{
        // ignore clicks on buttons/links inside card
        if(e.target.closest('button')||e.target.closest('a')) return;
        window.location.href='Profile.html';
      });
    });
    // Advanced search modal trigger: any element with search icon
    document.querySelectorAll('span.material-symbols-outlined').forEach(el=>{
      if(el.textContent.trim()==='search') el.addEventListener('click', ()=>{
        openModal({title:'Advanced Search', body:`<div class="form-row"><div class="col"><label>Specialty</label><select class="input" id="adv_spec"><option value="">Any</option><option>Business Strategy</option><option>Finance</option><option>Leadership</option></select></div><div class="col"><label>Max Price (SAR)</label><input id="adv_price" class="input" placeholder="e.g. 1000" /></div></div>`, footer:'<button class="btn close-modal">Cancel</button><button class="btn primary" id="adv_apply">Apply</button>'});
        setTimeout(()=>{document.getElementById('adv_apply').addEventListener('click', ()=>{ closeModal(); openModal({title:'Filters Applied', body:'(Mock) Filters applied.', footer:'<button class="btn close-modal">Close</button>'}); });},20);
      });
    });
  }

  function wireDashboard(){
    const navLinks = document.querySelectorAll('nav a');
    const reg = document.querySelector('form');
    const schedule = document.querySelectorAll('.time-slot');
    // If schedule slots absent, create them (small fallback)
    if(!schedule.length){
      const container = document.querySelector('.glass-panel + .glass-panel') || document.querySelector('main');
      // nothing to do if not found
    }
    // Side nav wiring: show/hide main sections
    navLinks.forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault(); const txt=a.textContent.trim();
        const sections = { 'لوحة التحكم': 'both', 'حسابي':'form', 'مواعيدي':'schedule', 'التوفر':'schedule', 'التقارير':'reports' };
        const show = sections[txt]||'both';
        const formEl = document.querySelector('form');
        const schedEl = document.querySelectorAll('.glass-panel')[1];
        if(formEl) formEl.parentElement.style.display = (show==='form' || show==='both')? 'block':'none';
        if(schedEl) schedEl.style.display = (show==='schedule' || show==='both')? 'block':'none';
        // create reports dummy
        let rpt = document.getElementById('reports_dummy');
        if(show==='reports'){
          if(!rpt){ rpt = document.createElement('div'); rpt.id='reports_dummy'; rpt.className='glass-panel rounded-xl p-6 md:p-8 mb-8'; rpt.innerHTML='<h2>Reports (mock)</h2><p>Sample reports go here.</p>'; document.querySelector('main').appendChild(rpt); }
          rpt.style.display='block';
        } else if(rpt) rpt.style.display='none';
      });
    });

    // Registration form validation on Save
    const saveBtn = document.querySelector('button.bg-primary');
    if(saveBtn){
      saveBtn.addEventListener('click', ()=>{
        const name = document.querySelector('input[placeholder="الاسم"]');
        const phone = document.querySelector('input[type="tel"]');
        const email = document.querySelector('input[type="email"]');
        const license = Array.from(document.querySelectorAll('input[type="text"]')).find(i=>i.placeholder.includes('الترخيص')||i.placeholder.includes('license') );
        const bio = document.querySelector('textarea');
        let ok=true; let msgs=[];
        if(!name || !isValidName(name.value)){ ok=false; msgs.push('Name invalid'); }
        if(!phone || !isValidPhone(phone.value)){ ok=false; msgs.push('Phone invalid'); }
        if(!email || !isValidEmail(email.value)){ ok=false; msgs.push('Email invalid'); }
        if(!license || !isValidLicense(license.value)){ ok=false; msgs.push('License invalid'); }
        if(!bio || !bio.value.trim()){ ok=false; msgs.push('Bio required'); }
        if(!ok){ openModal({title:'Validation Failed', body:`<ul>${msgs.map(m=>`<li>${m}</li>`).join('')}</ul>`, footer:'<button class="btn close-modal">Close</button>'}); }
        else{ openModal({title:'Success', body:'Information saved (mock).', footer:'<button class="btn close-modal">Close</button>'}); }
      });
    }

    // Schedule slot booking
    document.querySelectorAll('.time-slot').forEach(slot=>{
      slot.addEventListener('click', ()=>{
        if(slot.classList.contains('reserved')){
          openModal({title:'Cancel Slot?', body:`Cancel this reserved slot? <div style="margin-top:12px"><strong>${slot.textContent.trim()}</strong></div>`, footer:'<button class="btn close-modal">Close</button><button class="btn" id="cancel_slot">Cancel Slot</button>'});
          setTimeout(()=>{ document.getElementById('cancel_slot').addEventListener('click', ()=>{ slot.classList.remove('reserved'); closeModal(); }); },20);
        } else {
          openModal({title:'Book Slot', body:`Book this slot?<div style="margin-top:12px"><strong>${slot.textContent.trim()}</strong></div>`, footer:'<button class="btn close-modal">No</button><button class="btn primary" id="confirm_slot">Yes, Book</button>'});
          setTimeout(()=>{ document.getElementById('confirm_slot').addEventListener('click', ()=>{ slot.classList.add('reserved'); closeModal(); }); },20);
        }
      });
    });
  }

  // Initialize per page by title detection
  document.addEventListener('DOMContentLoaded', ()=>{
    const t = document.title || '';
    if(/الملف الشخصي|Profile/.test(t)) wireProfile();
    if(/اختر مجال|Choose|AmrTM/.test(t) || /اختر/.test(t)) wireHomepage();
    if(/Dashboard|لوحة التحكم|تسجيل المستشار/.test(t)) wireDashboard();
  });
})();
