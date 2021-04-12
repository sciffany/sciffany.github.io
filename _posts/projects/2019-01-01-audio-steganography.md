---
layout: plain-post
permalink: /steganography/
categories: [project]
image: steganography
ref: gsteganography
lang: MATLAB
---

Helped developed application which conceals text messages in music clips for reliable data transmission through air via inaudible high-frequency sound waves

**Methodology**

- Translate ASCII of text message into binary
- Encode bits into certain bands in inaudible high-frequency range
- Play music clip and read Fourier spectrogram from a recording device
- Determine highligted frequency bands and use inverse FFT to decode
