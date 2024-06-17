# Test Frontend Junior Developer

This is a test that we create to recruitment process of frontend junior developer for [Videsk](https://videsk.io).

```
Follow the deadlines and rules where you got this link.
```

If you're a recruiter you're welcome to fork this repository and use it in your recruitment process.

In case you're a developer, use it as a homework to practice or learn how to build web components.

1. [Rules](#rules)
2. [Overview](#overview)
3. [Tasks](#tasks)
4. [Using the API](#using-the-api)
5. [Bonus](#bonus)
6. [Submission](#submission)
7. [Useful Resources](#useful-resources)

# Rules

1. Not fork! Clone this repository. (public or private)
2. Use this template. We don't want to evaluate how do you configure compilers or environment.
3. You have 5 days to send this test.

> [!NOTE]  
> We'll verify the 5 days based on the time you took on send all commits to your repo

# Overview

You are required to create two types of custom web components: one for authors and another for articles. These components must fetch data from a REST API without authentication. The task includes creating a component for each article and another component to display all articles. You will also implement functionality to set the array of articles dynamically and display additional details upon interaction.

# Tasks

> [!TIP]
> You can define your own components name, but remember follow the best practices.

### Task 1: Create Article Component

- Display the title, image, company, and description.
- When the article is clicked, show the full content of the article.
- Fetch and display the author's information when the author's name is clicked.
- Ensure the component encapsulates its style and behavior using the Shadow DOM.
- Utilize HTML templates for the component's structure.
- Allow set all properties through setter and attributes
- Allow get all properties through getter

**Expected Result:**
A reusable custom web component that dynamically displays article details and fetches author information upon interaction.

### Task 2: Create Articles List Component

- Display a list of `article-item` components.
- Provide a method to set the articles array dynamically.
- Ensure the component encapsulates its style and behavior using the Shadow DOM.
- Utilize HTML templates for the component's structure.
- Allow set articles through setter
- Allow get all articles through getter

**Expected Result:**
A custom web component that dynamically renders a list of articles and updates based on the provided data array.

### Task 3: Create Author Component

- Display the author's name, avatar, birthdate, and bio.
- Add loading state IU through setter and getter property and attribute like `loading`
- Ensure the component encapsulates its style and behavior using the Shadow DOM.
- Utilize HTML templates for the component's structure.
- Allow set all properties through setter and attributes
- Allow get all properties through getter

**Expected Result:**
A reusable custom web component that dynamically displays author details upon interaction.

## CSS resources

You can optionally use Tailwind CSS in the styles of each component or your own.

Example using Tailwind:

```css
.my-style {
   @apply w-full h-full;
}
```

### Data Structures

**Article:**
```json
{
  "publishedAt": "2024-06-05T03:29:00.248Z",
  "title": "officia odio tempora",
  "image": "https://loremflickr.com/640/480",
  "company": "Brakus, Hyatt and Lesch",
  "description": "Rerum molestiae quod numquam nisi aut...",
  "content": "Veniam sint dolorum corporis vitae porro rem maiores earum doloribus...",
  "id": "24",
  "author": "24"
}
```

**User:**
```json
{
  "createdAt": "2024-06-04T14:44:52.367Z",
  "name": "Matthew Sanford",
  "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/701.jpg",
  "birthdate": "1999-07-13T03:40:56.697Z",
  "bio": "Sequi cum unde alias. Atque blanditiis numquam facilis...",
  "id": "1",
  "articles": []
}
```

# Using the API

Base URL: https://5fb46367e473ab0016a1654d.mockapi.io/

The REST API provides two main endpoints to fetch data: `/users` and `/articles`. Both endpoints support the following functionalities:

- **Find by ID:** `/users/:id` and `/articles/:id`
- **Search by Field:** Use the `search` parameter to match any field.
- **Limit Results:** Use the `limit` parameter to limit the number of records.
- **Sort Results:** Use `sortBy` to specify the field to sort by, and `order` to set the sorting order (`asc` for ascending, `desc` for descending).
- **Order by Field:** Use the `orderby` parameter to specify the field to order the results.

### Example usage

1. **Fetch All Users:**
   ```http
   GET /users
   ```

2. **Fetch a Specific User by ID:**
   ```http
   GET /users/:id
   ```

3. **Fetch Users with Search and Limit:**
   ```http
   GET /users?search=Matthew&limit=5
   ```

4. **Fetch All Articles:**
   ```http
   GET /articles
   ```

5. **Fetch a Specific Article by ID:**
   ```http
   GET /articles/:id
   ```

6. **Fetch Articles with Search and Sort:**
   ```http
   GET /articles?search=officia&sortBy=publishedAt&order=desc
   ```

### Documentation Reference

For more detailed information about filtering and querying, refer to the [MockAPI documentation](https://github.com/mockapi-io/docs/wiki/Code-examples#filtering).

# Bonus

> [!NOTE]  
> Bonus are optional

1. Create filters and sorter for articles, considering the feature should be able accesible through a method like `element.search()` or `element.sort()`. So the UI should use that properties.
2. Use `slot` on `articles` component to replace the default article and/or author component with any HTML.

# Submission

Upload your solution to your GitHub repository and share the link to developers@videsk.io with the subject "Frontend Dev Q2-2024" also your name and some optional explanation of your code.

# Useful Resources

- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)
