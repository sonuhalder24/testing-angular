it('DEBUG: should display email pattern validation error when field has invalid value', fakeAsync(() => {
  fixture.whenStable().then(() => {
    const emailCtrl = component.complexForm.controls['email'];
    const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');

    // Simulate typing invalid email
    elemInput.value = 'jgkff!@df.vv';
    elemInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    console.log('--- DEBUG LOG START ---');
    console.log('Value:', emailCtrl.value);
    console.log('Errors:', emailCtrl.errors);
    console.log('Valid:', emailCtrl.valid);
    console.log('Dirty:', emailCtrl.dirty, 'Touched:', emailCtrl.touched);
    console.log('Form valid:', component.complexForm.valid);

    // Query the DOM for error elements
    const errorNoEmail = fixture.nativeElement.querySelector('#error-no-email');
    const errorPatternEmail = fixture.nativeElement.querySelector('#error-pattern-email');

    console.log('errorNoEmail exists?', !!errorNoEmail);
    console.log('errorPatternEmail exists?', !!errorPatternEmail);
    console.log(
      'errorPatternEmail text:',
      errorPatternEmail ? errorPatternEmail.textContent.trim() : 'null'
    );
    console.log('--- DEBUG LOG END ---');

    // Expectations (these may fail, we just want logs for now)
    expect(emailCtrl.valid).toBeFalsy();
    expect(errorNoEmail).toBeFalsy();
    expect(errorPatternEmail).toBeTruthy();

    if (errorPatternEmail) {
      expect(errorPatternEmail.textContent.trim()).toBe('Pattern does not match.');
    }
  });
}));
