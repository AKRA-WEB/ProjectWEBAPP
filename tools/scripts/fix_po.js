const fs = require('fs');
const path = 'C:\\Users\\AKRA-Panich-Front\\akra-migration\\PO.html';
let content = fs.readFileSync(path, 'utf8');

const newContent = `    // =========================================================================
    // TAB 1: PR 
    // =========================================================================
    function renderTab1_PR() {
        const container = document.getElementById('pr-container');
        container.innerHTML = '';
        if(!appData.prList || appData.prList.length === 0) { 
            container.innerHTML = '<p class="col-span-full text-gray-500 text-center py-10 bg-white rounded-xl border border-dashed">ไม่มีคำขอซื้อใหม่</p>'; 
            return; 
        }

        const groupedPRs = {};
        appData.prList.forEach(pr => {
            const prodObj = appData.products.find(p => p.name === pr.product);
            const vendor = (prodObj && prodObj.vendor) ? prodObj.vendor : 'ไม่ระบุผู้จำหน่าย';
            const key = vendor + '|' + pr.warehouse;
            if (!groupedPRs[key]) groupedPRs[key] = { vendor, warehouse: pr.warehouse, items: [] };
            groupedPRs[key].items.push(pr);
        });

        Object.values(groupedPRs).forEach(group => {
            const card = document.createElement('div');
            card.className = "glass-card p-5 border-l-4 border-l-red-400";
            
            let itemsHtml = '<div class="space-y-3 mt-4 mb-5">';
            group.items.forEach((pr, i) => {
                itemsHtml += \`
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-start">
                        <div class="flex-1 pr-2">
                            <p class="font-bold text-gray-800 text-sm leading-tight mb-1">\${i+1}. \${pr.product}</p>
                            <p class="text-xs text-gray-500">ผู้ขอ: <span class="font-medium text-gray-700">\${pr.requester}</span> | เลขที่: <span class="font-medium text-brand-blue">\${pr.prNumber || '-'}</span></p>
                            \${pr.remark ? \\\`<p class="text-[11px] text-brand-orange mt-1.5 font-medium">หมายเหตุ: \${pr.remark}</p>\\\` : ''}
                        </div>
                        <div class="text-right flex flex-col items-end">
                            <div><span class="text-brand-blue font-bold text-base">\${pr.quantity}</span> <span class="text-xs text-gray-500">\${pr.unit || ''}</span></div>
                            <button onclick="rejectPR('\${pr.prUid}')" class="text-[10px] text-red-400 hover:text-red-600 mt-2 flex items-center gap-1 transition"><i data-lucide="x" class="w-3 h-3"></i> ไม่อนุมัติ</button>
                        </div>
                    </div>
                \`;
            });
            itemsHtml += '</div>';
            
            const groupPrUids = group.items.map(i => i.prUid).join(',');

            card.innerHTML = \`
                <div class="flex justify-between items-start mb-2 border-b border-gray-100 pb-3">
                    <span class="text-base font-bold text-brand-blue flex items-center gap-2"><i data-lucide="building-2" class="w-5 h-5"></i> \${group.vendor}</span>
                    <span class="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">คลัง: <span class="font-bold text-gray-800">\${group.warehouse}</span></span>
                </div>
                \${itemsHtml}
                <button onclick="approveGroupPR('\${group.vendor}', '\${group.warehouse}', '\${groupPrUids}')" class="btn-outline-action btn-success w-full justify-center py-3 text-sm border-emerald-300 shadow-sm hover:shadow-md transition">✅ อนุมัติทั้งกลุ่มเป็น 1 บิล (PO)</button>
            \`;
            container.appendChild(card);
        });
        lucide.createIcons({ root: container });
    }

    function approveGroupPR(vendor, warehouse, prUidsStr) {
        const prUids = prUidsStr.split(',');
        const groupItems = appData.prList.filter(p => prUids.includes(p.prUid));
        if(groupItems.length === 0) return;

        const vendorInput = document.getElementById('create-po-vendor');
        vendorInput.value = vendor === 'ไม่ระบุผู้จำหน่าย' ? '' : vendor;

        document.getElementById('c-ref-pr-row').value = prUidsStr;
        document.getElementById('modal-create-po-title').innerText = \`อนุมัติและสร้างบิล (\${groupItems.length} รายการ)\`;
        document.getElementById('modal-create-po-subtitle').innerText = \`คุณสามารถปรับยอดจำนวนสั่ง หรือเพิ่มสินค้ารายการอื่นได้ก่อนกดบันทึก\`;
        document.getElementById('create-po-warehouse').value = warehouse || "";
        
        const container = document.getElementById('create-po-items-container');
        container.innerHTML = '';
        groupItems.forEach(pr => {
            addCreatePoItemRow(pr.product, pr.quantity);
        });

        document.getElementById('modal-create-po').classList.remove('hidden');
        document.getElementById('modal-create-po').classList.add('flex');
    }

    function rejectPR(prUid) {
        showConfirmModal("คุณต้องการไม่อนุมัติคำขอนี้ใช่หรือไม่?", () => {
            const remark = prompt("ระบุเหตุผลที่ไม่อนุมัติคำขอนี้ (ถ้ามี):") || "ไม่อนุมัติ";
            apiAction('rejectPR', { prUid: prUid, remark: \`[ไม่อนุมัติ]: \${remark}\` }).then(res => {
                if(res.success) { showNotification("ไม่อนุมัติเรียบร้อย"); loadInitialData(); }
            });
        });
    }

    function approvePRToPOForm(prUid) {
        const pr = appData.prList.find(p => p.prUid === prUid);
        if(!pr) return;

        const vendorInput = document.getElementById('create-po-vendor');
        vendorInput.value = "";
        const prodObj = appData.products.find(p => p.name === pr.product);
        if (prodObj && prodObj.vendor) vendorInput.value = prodObj.vendor;

        document.getElementById('c-ref-pr-row').value = pr.prUid;
        document.getElementById('modal-create-po-title').innerText = \`อนุมัติและสร้างบิล (อ้างอิง \${pr.prNumber})\`;
        document.getElementById('modal-create-po-subtitle').innerText = \`คุณสามารถปรับยอดจำนวนสั่ง หรือเพิ่มสินค้ารายการอื่นได้ก่อนกดบันทึก\`;
        document.getElementById('create-po-warehouse').value = pr.warehouse || "";
        
        const container = document.getElementById('create-po-items-container');
        container.innerHTML = '';
        addCreatePoItemRow(pr.product, pr.quantity);

        document.getElementById('modal-create-po').classList.remove('hidden');
        document.getElementById('modal-create-po').classList.add('flex');
    }

    function openPurchasingForm() {
        document.getElementById('c-ref-pr-row').value = ""; 
        document.getElementById('modal-create-po-title').innerText = \`สร้างบิลใหม่ (Direct PO)\`;
        document.getElementById('modal-create-po-subtitle').innerText = \`โปรดระบุข้อมูลให้ครบถ้วนก่อนบันทึก\`;

        document.getElementById('create-po-vendor').value = "";
        document.getElementById('form-create-po').reset();
        document.getElementById('create-po-items-container').innerHTML = '';
        
        addCreatePoItemRow(); 
        document.getElementById('modal-create-po').classList.remove('hidden');
        document.getElementById('modal-create-po').classList.add('flex');
    }

    function closeCreatePoModal() {
        document.getElementById('modal-create-po').classList.add('hidden');
        document.getElementById('modal-create-po').classList.remove('flex');
    }

    function addCreatePoItemRow(product = '', qty = '') {
        const container = document.getElementById('create-po-items-container');
        const div = document.createElement('div');
        div.className = "create-po-item-row flex items-center relative bg-white rounded-lg border border-gray-200 mt-2 focus-within:z-50";
        div.innerHTML = \`
            <div class="flex-1 relative">
                <input type="text" class="w-full px-4 py-2.5 text-sm font-medium outline-none rounded-l-lg c-product" placeholder="ชื่อสินค้า..." value="\${product}" required autocomplete="off">
                <ul class="suggestion-box absolute z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto hidden mt-1 divide-y divide-gray-50 top-full left-0"></ul>
            </div>
            <div class="w-32 border-l border-gray-200">
                <input type="number" class="w-full px-3 py-2.5 text-sm font-bold text-gray-700 outline-none text-center c-qty" placeholder="จำนวน" min="1" value="\${qty}" required>
            </div>
            <button type="button" onclick="this.parentElement.remove()" class="text-red-400 hover:text-red-600 px-4 py-2.5 font-bold transition border-l border-gray-200 bg-transparent border-none">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        \`;
        container.appendChild(div);
        setupProductAutocompleteForPO(div.querySelector('.c-product'));
        lucide.createIcons();
    }

    async function submitDirectPO(e) {
        e.preventDefault();
        const vendor = document.getElementById('create-po-vendor').value.trim();
        const warehouse = document.getElementById('create-po-warehouse').value;

        if(!vendor || !warehouse) return showNotification('กรุณาเลือก Vendor และคลังสินค้าให้ครบถ้วน', 'warning');

        const items = [];
        let hasError = false;
        document.querySelectorAll('.create-po-item-row').forEach(row => {
            const product = row.querySelector('.c-product').value.trim();
            const quantity = row.querySelector('.c-qty').value.trim();
            if(!product || !quantity) hasError = true;
            else items.push({ product, quantity });
        });

        if(hasError || items.length === 0) return showNotification('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน', 'warning');

        const refPrRow = document.getElementById('c-ref-pr-row').value;

        document.getElementById('btn-submit-direct-po').disabled = true;
        document.getElementById('btn-submit-direct-po').innerHTML = '<div class="spinner spinner-sm mr-2 border-t-white"></div> บันทึก...';

        let res;
        if (refPrRow) {
            res = await apiAction('approvePR', { 
                vendor: vendor, poNumber: "", warehouse: warehouse, items: items, prUid: refPrRow 
            });
        } else {
            res = await apiAction('createPO', { vendor, poNumber: "", warehouse, items });
        }
        
        const productNames = items.map(i => i.product);
        apiAction('updateProductVendor', { vendor, products: productNames });

        closeCreatePoModal();
        document.getElementById('btn-submit-direct-po').disabled = false;
        document.getElementById('btn-submit-direct-po').innerText = 'บันทึกสั่งซื้อ (Create PO)';
        
        if (res && res.success) {
             showNotification("สร้างบิลเรียบร้อย");
             loadInitialData();
        } else {
             showNotification("เกิดข้อผิดพลาด: " + (res ? res.message : ''), "error");
        }
    }`;

const regex = /    \/\/ =========================================================================\s*    \/\/ TAB 1: PR\s*    \/\/ =========================================================================\s*    function renderTab1_PR\(\) \{[\s\S]*?async function submitDirectPO\(e\) \{[\s\S]*?loadInitialData\(\);\s*\}\s*else\s*\{\s*showNotification\("เกิดข้อผิดพลาด: " \+ \(res \? res\.message : ''\), "error"\);\s*\}\s*\}/;

content = content.replace(regex, newContent);
fs.writeFileSync(path, content);
console.log("Replaced successfully!");