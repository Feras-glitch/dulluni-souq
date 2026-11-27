def enter_parent(pg, pin='1234'):
    """يدخل وضع الوالدين من شاشة القرّاء؛ ينشئ الرمز إن لم يكن موجودًا."""
    pg.click('[data-parent-btn]')
    pg.wait_for_selector('#pin1')
    if pg.locator('#pin2').count():
        pg.fill('#pin1', pin); pg.fill('#pin2', pin); pg.click('[data-pin-save]')
    else:
        pg.fill('#pin1', pin); pg.click('[data-pin-enter]')
    # رمز الاستعادة يظهر عند إنشاء الرمز (أو أول دخول بعد التحديث)
    pg.wait_for_selector('.parent, [data-recovery-ok]')
    if pg.locator('[data-recovery-ok]').count():
        pg.evaluate("window.__rcode = document.querySelector('[data-recovery-code]').textContent")
        pg.click('[data-recovery-ok]')
    pg.wait_for_selector('.parent')

def exit_parent(pg):
    pg.click('[data-parent-btn]'); pg.wait_for_selector('.profiles')

def open_settings(pg):
    pg.click('[data-settings]'); pg.wait_for_selector('.setting')

def close_modal(pg):
    pg.keyboard.press('Escape'); pg.wait_for_selector('#modal-root', state='hidden')

def add_child_in_parent(pg, name, girl=False):
    pg.fill('.parent #new-name', name)
    if girl: pg.check('.parent input[value=f]')
    pg.click('.parent .add-form button[type=submit]')
    pg.wait_for_function('n => [...document.querySelectorAll(".parent .pname")].some(e => e.textContent.includes(n))', arg=name)
