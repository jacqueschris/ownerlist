### **Telegram Mini App - Real Estate Platform**

#### **Overview:**

A **mobile-first** real estate mini app within **Telegram**, designed to allow users to **list, search, and manage** properties for **sale or rent**. Users can **save favorites, book viewings**, and set preferences for better discovery. The app provides an intuitive and seamless experience, optimized for Telegram’s interface.

---

### **Key Features & Screens**

#### **1. Home / Search Screen**

- **Search Bar** (Always Visible)
- **Filter Options:**
  - **Type:** Buy / Rent
  - **Price Range**
  - **Location** (City, Region, or GPS-based)
  - **Property Type:** Apartment, House, Villa, Office, etc.
  - **Size:** Square meters (optional)
  - **Number of Bedrooms & Bathrooms**
  - **Furnished / Unfurnished**
  - **Amenities:** Balcony, Pool, Parking, etc.
- **Search Results:**
  - Grid/List view of properties with **thumbnail, price, and location**
  - Clicking a property opens the **detailed listing page**

---

#### **2. Property Listing Page**

- **Full Property Details:**
  - **Photos / Gallery**
  - **Title** (E.g., "Modern 2BR Apartment in Downtown")
  - **Price**
  - **Property Type** (House, Apartment, etc.)
  - **Sell/Rent** status
  - **Location (Map preview if possible)**
  - **Property Size**
  - **Bedrooms & Bathrooms**
  - **Furnishing Details**
  - **Description** (Owner’s Notes)
  - **Availability for Viewing** (Book a visit)
  - **Owner Details & Contact Options (Inline Button)**
  - **Favorite Button (Save for Later)**
  - **Request a Viewing Button** (User can select an available slot from the lister’s schedule)

---

#### **3. Favorites Screen**

- **List of saved properties**
- **Easy access to property details**
- **Remove from favorites option**

---

#### **4. My Listings Screen**

- **List of properties added by the user**
- **Actions per listing:**
  - **Edit details**
  - **Put On Hold / Activate**
  - **Delete property**
  - **View inquiries / scheduled viewings**
  - **Manage Viewing Requests** (Accept/Reject)

---

#### **5. Add New Property Screen**

- **Upload Photos**
- **Fill property details** (same as Listing Page)
- **Set Availability for Viewings:**
  - User selects **days of the week** and a **time range** when they can accept viewings.
- **Location Selection:**
  - User types in the address.
  - OpenStreetMap displays a pin at the detected location.
  - The pin is **draggable** so users can adjust the exact property location.
- **Submit Listing**

---

#### **6. Profile & Search Presets**

- **User Profile Details** (Name, Contact)
- **Preset Search Filters:** Users can save preferred search criteria (e.g., looking for a 2BR apartment under $1000 in New York)

---

#### **7. Viewing & Booking System**

- **Set availability for viewings** (Calendar-based selection of days and time ranges)
- **Users can request a viewing based on available slots**
- **Calendar-Based Viewing Requests:**
  - Users see a **calendar interface** that only shows dates corresponding to the lister's available days.
  - Users can select a **time slot** based on the lister’s available time range.
- **Lister’s Viewing Requests Page:**
  - View all incoming requests
  - Accept or Reject each request
  - Notifications sent to requestor if approved/rejected

---

#### **8. Saved Searches & Alerts Screen**

- **List of saved searches** (Maximum of 3 for free-tier users)
- **Users receive alerts when a new property matches their saved search criteria**
- **Manage and delete saved searches**

---

#### **9. Notifications System**

- **New message from interested buyers/renters**
- **New viewing request**
- **Viewing confirmation (Accepted/Rejected)**
- **Property inquiry updates**
- **New property alert for saved searches**

---

### **Design Considerations**

- **Mobile-first** approach (optimized for touch interaction)
- **Simple UI with Telegram’s native design language**
- **Quick actions & easy navigation**
- **Color Scheme:**
  - **Yellow:** #F8F32B
  - **Black:** #000000
  - **White:** #FFFFFF
  - **Gray:** #8D99AE
  - **Blue:** #2B2D42

