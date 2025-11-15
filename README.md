*Erin Noelle Ambuo - IDEA9103: Creative Coding Group Major Project Individual Part*

# Untitled (Bull) (1973) by Elaine de Kooning 
### Derived Individual Code by Erin Ambulo
<br>
<b>Expressing Movement through Perlin Noise</b>
<br>My individual work modifies the background of the group code by replacing the geometric grid pattern with a Perlin-noise-driven particle field. This creates a smooth, directional flow behind the bull while keeping the original foreground animation intact. The result is a layered composition where foreground and background behave differently yet cohesively.

---

### Part 1: How to Interact with the Artwork
<br>This artwork begins animating automatically when the page loads. No user interaction (clicking, dragging, mouse movement) is required. The animation runs continuously and indefinitely until the browser tab is closed or refreshed. The sketch is also fully responsive; resizing the browser window triggers the work to redraw and re-scale itself according to the new screen dimensions.

<br>In short:
> Open the page → the animation starts → it evolves forever.
<br>

---

### Part 2: My Individual Approach
<br>For my individual component, I chose Perlin Noise as my core animation driver. My goal was to extend the group’s concept of separating the foreground (bull) from the background, while making the background feel more alive, dynamic, and expressive.

***My Focus:***
- Keep the bull intact as the main identifiable subject
- Transform the background into a flowing, painterly motion field
- Preserve the original colour palette sampled from our group’s background image
- Animate using noise-driven particles to communicate directional movement
- Create contrast between foreground and background motions

***Why Perlin Noise?***
- smooth randomness
- organic movement patterns
- fluid transitions rather than sharp jittery changes

<br>This allowed me to create a background that feels like a living environment behind the bull.

#### Visual Inspirations
I drew direct inspiration from generative artworks on OpenProcessing that use:
- circular particle systems
- directional flow fields
- palette-derived gradients
- Perlin-noise-driven motion

#### 1. Growing Patients
*by Mascaria*

<img width="500" height="350" alt="Growing Patients" src="https://i.imgur.com/LdAAbkT.png" />

[OpenProcessing Source](https://openprocessing.org/sketch/2049655)

Uses swarms of dots to build colour through repeated layering, creating thick atmospheric gradients.
<br>
<br>
#### 2. Tumbled Grouped
*by Mascaria*

<img width="500" height="350" alt="Tumbled Grouped" src="https://i.imgur.com/EZKe8xo.png" />

[OpenProcessing Source](https://openprocessing.org/sketch/2064912)

Shows how noise-driven circular particles can form visually coherent direction, rhythm, and colour density.
<br>
<br>

Both helped me understand how to:
> - blend large numbers of particles into a single visual mass
> - control the “flow direction” of a noisy field
> - maintain palette consistency while producing organic visual complexity

<br>My final background mimics a rising diagonal movement “/”, echoing the implied upward momentum of the bull.

#### Distinction from Group Members
<br>To ensure my work is clearly differentiated:

***My Background:***
- uses 3,000 Perlin-noise-driven particles
- each particle carries a colour sampled from our background image
- particles move with a blended directional bias (up-right)
- thick opacity layers create a gradient-painterly environment
- motion is fluid, smooth, and perpetual
- the animation is not grid-based (unlike the original)

***My Foreground (Bull):***
- still uses the group’s grid-based rendering
- but I adjusted:
> - rate values
> - amplitude
> - size multiplier
- resulting in a slightly tighter, more contained movement
- providing clarity: calm bull vs energetic background

<br>Where the group code animates both layers similarly, my version introduces two visually distinct animation systems.

---

### Part 3: Technical Explanation of Individual Code
<br>My individual contribution happened across four major commits, each deepening the technique and evolving the output.



---

<b>AI Utilisation Disclosure</b>
<br>In completing this assessment, our group used AI tools such as ChatGPT and Grammarly to support the development process. ChatGPT assisted us in exploring, comparing, and breaking down possible coding approaches based on our initial concepts. Its use was intentionally limited to the scope of IDEA9103’s taught lessons to ensure all derived code remained aligned with our existing skills, knowledge, and coursework framework, with only minimal flexibility for techniques outside the syllabus. Grammarly was used solely to refine our writing by reducing redundancy and improving clarity and conciseness.
