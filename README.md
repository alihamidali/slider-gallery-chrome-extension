## How to use 'User JavaScript and CSS' extension

### 1. Install the Extension
- Download and install User JavaScript and CSS from https://chromewebstore.google.com/

### 2. Use the Extension
1. **Click the extension icon** in Chrome's toolbar
2. Click on the **New rule** button, it will open a new tab
3. **Add your code**:

**JavaScript Tab:**
```javascript
// Example: Change page background
document.body.style.background = "lightgray";

// Example: Add custom element
const div = document.createElement('div');
div.innerHTML = 'Hello World!';
document.body.prepend(div);
```
**CSS Tab:**
```css
/* Hide annoying elements */
.advertisement, .popup {
  display: none !important;
}

/* Custom styling */
header {
  background: blue !important;
}
```
4. Click **Save** - Refresh the page to load the javascript!
5. **Toggle on/off** with the switch
