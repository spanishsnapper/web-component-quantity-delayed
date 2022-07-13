/**
 * 
 * Quantity +/- switcher with limits on max/min
 * Delays update to 500ms on quantity ajax to reduce server calls
 * We can then add an event listener for "updated" event.
 * Use in HTML: <quantity-updater min='1' max='999' quantity='7'></quantity-updater>
 */



// Creates MyElements extending HTML Element
class QuantityMinMax extends HTMLElement {

    static get observedAttributes() { return ['quantity','min','max','quantity_ajax']; }

    // Fires when an instance of the element is created or updated
    constructor() {

        super();

        // Create a shadow root
        this.attachShadow({mode: 'open'});

        // Global Vars: 
        this.delayTimer;        // To delay AJAX calls
        this.qtyTimer;          // For mouseover event on modify quantity button
        this.AJAX_DELAY = 1000; // How long to wait before updating ajax quantity.
        this.MIN_QTY = 1;       // Default minimum quantity
        this.MAX_QTY = 999;     // Default maximum quantity
        this.render();
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {

        // console.warn("Quantity updater loaded");

        

        // Provide event to listen for outside component: 
        this.quantityUpdatedEvent = new CustomEvent("update", {
            bubbles: true,
            cancelable: false,
            composed: true
          });

    }

    // Fires when an instance was removed from the document
    disconnectedCallback() {
        // console.warn("Quantity updater removed");
        clearTimeout(this.delayTimer);
    }


    // Fires when an attribute was added, removed, or updated
    attributeChangedCallback(attrName, oldVal, newVal) {
        
        // console.log(attrName + " updated to " + newVal);
        
        if (attrName=="quantity" && oldVal !== newVal) {
            this.delayedQuantityUpdate();
        }
        
    }

    
    render(){

        // console.log("Initial Render");

        const style = document.createElement('style');

        const wrapper = document.createElement("div");

        const minus_btn = document.createElement("div") ;
        const qty_val = document.createElement("div") ;
        const plus_btn = document.createElement("div") ;
        

        // Add the QTY input:
        const qty_val_input = document.createElement("input");        
        qty_val_input.type="text";
        qty_val_input.size=3;
        qty_val_input.pattern = "\\d{1,3}";
        qty_val_input.value = this.getAttribute("quantity");
        qty_val_input.disabled = true;
        qty_val.appendChild(qty_val_input);


        // Plus and Minus listeners: 
        minus_btn.innerText = "-";
        minus_btn.addEventListener("click", ()=> { this.modifyQty(-1) } );
        minus_btn.addEventListener("mousedown", ()=> { this.qtyTimer = setInterval( ()=> { this.modifyQty(-1) }, 200 ) } );
        minus_btn.addEventListener("mouseup", ()=> { clearInterval(this.qtyTimer); } );

        plus_btn.innerText = "+";
        plus_btn.addEventListener("click", ()=> { this.modifyQty(+1) } );
        plus_btn.addEventListener("mousedown", ()=> { this.qtyTimer = setInterval( ()=> { this.modifyQty(+1) }, 200 ) } );
        plus_btn.addEventListener("mouseup", ()=> { clearInterval(this.qtyTimer); } );
       

        wrapper.appendChild(minus_btn);
        wrapper.appendChild(qty_val);
        wrapper.appendChild(plus_btn);
        
        wrapper.className   = "wrapper";

        this.shadowRoot.append(style,wrapper);

        this.componentStyle();
       
    }


    /** Update the quantity with buttons pressed */
    modifyQty(n){

        // console.warn("updating Quantity");

        clearTimeout(this.delayTimer);

        const minQty     = isNaN( this.getAttribute("min") ) ? this.MIN_QTY : Number(this.getAttribute("min"));
        const maxQty     = isNaN( this.getAttribute("max") ) ? this.MAX_QTY : Number(this.getAttribute("max"));
        const currentQty = isNaN( this.getAttribute("quantity") ) ? "1" : Number(this.getAttribute("quantity"));

        let newQuantity = currentQty + n;
        if (newQuantity<minQty) { newQuantity = minQty; }
        if (newQuantity>maxQty) { newQuantity = maxQty; }
        
        this.setAttribute("quantity", newQuantity);

        this.shadowRoot.querySelector('input').value = newQuantity;

       
    }


    /**
     * Update the AJAX quanity after multiple clicks stopped on the quantity buttons
     */
    delayedQuantityUpdate() {

        // console.log ("Inside update caller: " + this.getAttribute("quantity_ajax") );

        if (this.getAttribute("quantity_ajax") === null) {
            this.setAttribute("quantity_ajax",  this.getAttribute("quantity") );
            return;
        }

        this.delayTimer = setTimeout( ()=>{
            
            // If inital set, then don't fire event to avoid needless ajax call.
            let fire_ajax = (this.getAttribute("quantity_ajax") !== this.getAttribute("quantity"));
           
            this.setAttribute("quantity_ajax", this.getAttribute("quantity") );

            if ( fire_ajax ) {
                this.dispatchEvent(this.quantityUpdatedEvent);
                // console.log("fire ajax event");
            }
            

        }, this.AJAX_DELAY);


    }


    componentStyle() {
        
        this.shadowRoot.querySelector('style').textContent = `

        :host {
            --border-color:     #DDD;
            --background-color: #FFF;
        }
         
        .wrapper {
            width:100px;
            height: 30px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            background-color: var(--background-color);
            border: 1px solid var(--border-color);

          }

          .wrapper div {
              margin:0;
              width:30px;
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              text-align:center;
              cursor:pointer;
          }
          .wrapper div * {
                pointer-events:none;
            }

          .wrapper div:nth-child(2) {
            width:40px;
            border-left:1px solid var(--border-color);
            border-right:1px solid var(--border-color);
            cursor:none;
          }

          input{
              width:90%;
              margin:0 auto;
              text-align:center;
              border:none;
              background:none;
          }
        
    
        `;
       
    
      }

}

// Registers custom element
window.customElements.define('quantity-updater', QuantityMinMax);

