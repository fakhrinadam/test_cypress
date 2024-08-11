/// <reference types="cypress" />

describe('Login Jubelio', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('https://v2.jubelio.com/auth/login');
        cy.get('.css-17h3ieo').dblclick();
        cy.get('#textfield-email').should('be.visible');
        cy.get('#textfield-email').click().type('fakhrinka@gmail.com');
        cy.get('#textfield-password').should('be.visible');
        cy.get('#textfield-password').click().type('T3stpassword!');
        cy.get('.MuiButton-root').click();
        cy.get('form').submit();
        cy.wait(10000);
    });
    it('Create Pesanan', () => {
        cy.get('.d-flex.false > .MuiButtonBase-root').should('be.visible');
        cy.get('.false[href="/purchasing"]').click();
        cy.get('.bg-white[href="/purchasing/transactions"]').click();
        cy.get('.pr-0.MuiButton-root').should('be.visible');
        cy.get('.pr-0.MuiButton-root').click();
        cy.get('.text-white').should('be.visible')
        cy.get('.text-white').click()
        cy.get('[placeholder="Pilih pemasok"]').click();
        cy.get('[placeholder="Pilih pemasok"]').type('BLIBLI');
        cy.get('.MuiAutocomplete-option').should('be.visible');
        cy.get('.MuiAutocomplete-option').click();
        cy.get('[placeholder="Pilih Lokasi"]').click();
        cy.get('[placeholder="Pilih Lokasi"]').type('Pusat');
        cy.get('.MuiAutocomplete-option').should('be.visible');
        cy.get('.MuiAutocomplete-option').click();
        cy.get('.py-2.MuiButton-root').click();
        cy.get('.css-b52kj1').type('Test Product');
        cy.get('.flex-row').click();
        cy.get('[data-index="1"] .css-ecji29 > div:nth-of-type(2) .grid-cell-content').click().type('100000');
        cy.get('[data-index="1"] div:nth-of-type(3) .grid-cell-content').click().type('1');
        cy.get('.text-white').should('be.visible');
        cy.get('.text-white').click();
    });   
    it('Edit Pesanan', () => {
        cy.get('.d-flex.false > .MuiButtonBase-root').should('be.visible');
        cy.get('.false[href="/purchasing"]').click();
        cy.get('.bg-white[href="/purchasing/transactions"]').click();
        cy.get('.pr-0.MuiButton-root').should('be.visible');
        cy.get('.pr-0.MuiButton-root').click();
        cy.intercept('GET', 'https://api-platform.jubelio.com/purchase/v2/orders/?page=1&q=&sort_by=transaction_date&page_size=25&sort_direction=DESC').as('getOrders');
        cy.get('.MuiInputBase-sizeSmall').should('be.visible')
        cy.get('.MuiInputBase-sizeSmall').click().type('PO-000000001');
        cy.get('.MuiButton-fullWidth').click();
        cy.get('.MuiInputBase-sizeSmall').should('be.visible')
        cy.intercept('GET', 'https://api-platform.jubelio.com/purchase/v2/orders/?page=1&sort_by=transaction_date&page_size=25&sort_direction=DESC&q=PO-000000001').as('filterOrders');
        cy.get('.pb-2.font-weight-lightbold').should('have.text', 'PO-000000001');
        cy.get('.pb-2.font-weight-lightbold').should('be.visible');
        cy.get('.pb-2.font-weight-lightbold').click();
        cy.get('.text-second').should('be.visible');
        cy.get('.ml-1').should('be.visible');
        cy.get('.ml-1').click();
        cy.get('[data-index="1"] .mb-0').should('be.visible');
        cy.get('[data-index="1"] .css-ecji29 > div:nth-of-type(2)').should('be.visible');
        cy.get('[data-index="1"] .css-ecji29 > div:nth-of-type(2)').click().type('150000');
        cy.get('[data-index="1"] div:nth-of-type(3) .grid-cell-content').should('be.visible');
        cy.get('[data-index="1"] div:nth-of-type(3) .grid-cell-content').click().type('3');
        cy.get('.text-white').should('be.visible');
        cy.get('.text-white').click();
    });
    it('Search Pesanan', () => {
        cy.get('.d-flex.false > .MuiButtonBase-root').should('be.visible');
        cy.get('.false[href="/purchasing"]').click();
        cy.get('.bg-white[href="/purchasing/transactions"]').click();
        cy.get('.pr-0.MuiButton-root').should('be.visible');
        cy.get('.pr-0.MuiButton-root').click();
        cy.intercept('GET', 'https://api-platform.jubelio.com/purchase/v2/orders/?page=1&q=&sort_by=transaction_date&page_size=25&sort_direction=DESC').as('getOrders');
        cy.get('.MuiInputBase-sizeSmall').should('be.visible')
        cy.get('.MuiInputBase-sizeSmall').click().type('PO-000000003');
        cy.intercept('GET', 'https://api-platform.jubelio.com/purchase/v2/orders/?page=1&sort_by=transaction_date&page_size=25&sort_direction=DESC&q=PO-000000003').as('filterOrders');
        cy.get('.MuiButton-fullWidth').click();
        cy.get('.MuiInputBase-sizeSmall').should('be.visible')
        cy.wait(10000)
        cy.wait('@filterOrders').then((interception) => {
            console.log('Intercepted request:', interception);
            expect(interception.response.statusCode).to.eq(200);
            const responseBody = interception.response.body;
            expect(responseBody.data).to.be.an('array').that.is.not.empty;
            const orderFound = responseBody.data.some(order => order.purchaseorder_no === 'PO-000000003');
            expect(orderFound).to.be.true;
            if (orderFound) {
                const order = responseBody.data.find(order => order.purchaseorder_no === 'PO-000000003');
                expect(order).to.have.property('purchaseorder_no', 'PO-000000003');
                expect(order).to.have.property('supplier_name', 'DEALPOS');
                expect(order).to.have.property('status', 'ACTIVE');
                expect(order).to.have.property('location_name', 'Pusat');
            }
        });
    });
});