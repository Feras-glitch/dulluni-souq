def enter_parent(pg, pin='1234'):
    """يدخل وضع الوالدين من شاشة القرّاء؛ ينشئ الرمز إن لم يكن موجودًا."""
    pg.click('[data-parent-btn]')
    pg.wait_for_selector('#pin1')
    if pg.locator('#pin2').count():
        pg.fill('#pin1', pin); pg.fill('#pin2', pin); pg.click('[data-pin-save]')
    else:
        pg.fill('#pin1', pin); pg.click('[data-pin-enter]')
    pg.wait_for_selector('.parent')

def exit_parent(pg):
    pg.click('[data-parent-btn]'); pg.wait_for_selector('.profiles')

def add_child_in_parent(pg, name, girl=False):
    pg.fill('.parent #new-name', name)
    if girl: pg.check('.parent input[value=f]')
    pg.click('.parent .add-form button[type=submit]')
    pg.wait_for_function('n => [...document.querySelectorAll(".parent .pname")].some(e => e.textContent.includes(n))', arg=name)
