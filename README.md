# web-component-quantity-delayed

This is a simple quantity update changer web component written in Vanilla JS that allows the programmer to set a predetermined wait time before firing an update event. 

Quantity box with + - buttons that fires an event after no change for predetermined time.   
Original use was to reduce Ajax calls to server for cart updates where unit price varied depending on quantity.


The goal of the component is to reduce the number of calls to the server requesting a cart refresh by waiting until the user has stopped clicking the plus or minus buttons and have decided upon the quantity they wish to update. 

Wait time can be adjusted via **AJAX_DELAY** constant. 

Min and Max values can be set via **QTY_MIN** and **QTY_MAX** constants. 

Styling is provided within the component.

## Include the file: 

    <script src='.your-path/src/component/quantity.js' type='module'></script>

## HTML Syntax: 

    <quantity-updater min='1' max='999' quantity='7'></quantity-updater>

## Listener Syntax (JS)

    elem.addEventListener("update", (e)=>{ ... } ); 


