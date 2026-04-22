(() => {
  // Exit early if not an assorted links post
  const urlPattern = /marginalrevolution\.com\/marginalrevolution\/\d{4}\/\d{2}\/.*assorted.*links/i;
  if (!urlPattern.test(window.location.href)) {
    return;
  }

  // Parse numbered links from the post body
  function parseLinks() {
    const links = {};
    const entryContent = document.querySelector('.entry-content');
    if (!entryContent) return links;

    // Strategy 1: Look for <ol> (ordered list)
    const ol = entryContent.querySelector('ol');
    if (ol) {
      const listItems = ol.querySelectorAll('li');
      listItems.forEach((li, index) => {
        const anchor = li.querySelector('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          const text = anchor.textContent.trim();
          if (href && text) {
            links[index + 1] = { text, href };
          }
        }
      });
      if (Object.keys(links).length > 0) {
        return links;
      }
    }

    // Strategy 2: Look for numbered paragraphs (e.g., "1. <a>Title</a>")
    const paragraphs = entryContent.querySelectorAll('p');
    let linkNumber = 1;

    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      // Check if paragraph starts with expected number
      const match = text.match(/^(\d+)[.)]\s+/);
      if (match && parseInt(match[1]) === linkNumber) {
        const anchor = p.querySelector('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          const linkText = anchor.textContent.trim();
          if (href && linkText) {
            links[linkNumber] = { text: linkText, href };
            linkNumber++;
          }
        }
      }
    });

    return links;
  }

  const linkMap = parseLinks();

  // Find link references: #X, X., X), re: X (avoid false positives like "in 3 different")
  function findLinkReferences(text) {
    const refs = new Set();
    // Only match strong indicators of link references:
    // #1, #2 (always with hash)
    // 1., 2. (number-period at line start or after space/punctuation)
    // 1), 2) (number-closing-paren)
    // re: 1, re: #1 (explicit reply format)
    // 1– or 1- (number-emdash/dash, common format)
    const patterns = [
      /#(\d{1,2})(?=[\s\-–.\)\:])/g,           // #1, #2, #3 followed by space/dash/period/paren/colon
      /(?:^|\s)(\d{1,2})\.(?=\s)/gm,           // 1. at line start or after space (number-period-space)
      /(?:^|\s)(\d{1,2})\)(?=[\s,;])/gm,       // 1) at line start or after space
      /(?:^|\s)(\d{1,2})[\-–](?=\s)/gm,        // 1- or 1– at line start or after space
      /^(\d{1,2})\s/m,                         // 1 at start of comment followed by space
      /re:\s*#?(\d{1,2})(?=[\s\-–.\)]|$)/gm    // re: 1 or re: #1 format
    ];

    patterns.forEach((regex) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        const linkNum = match[1];
        if (linkNum && linkMap[linkNum]) {
          refs.add(parseInt(linkNum));
        }
      }
    });
    return refs;
  }

  // Find all comments and inject banners
  function injectBanners() {
    // MR comments use: <article class="blog-comment"> structure
    const comments = document.querySelectorAll('article.blog-comment');

    comments.forEach((comment) => {
      // Get the comment text content
      const commentBody = comment.querySelector('.comment-content');
      if (!commentBody) return;

      // Skip if banners already injected for this comment
      if (comment.querySelector('.mru-link-ref')) {
        return;
      }

      const commentText = commentBody.textContent;
      const referencedLinks = findLinkReferences(commentText);

      // Inject banners for each referenced link (sorted by number)
      const sortedLinks = Array.from(referencedLinks).sort((a, b) => a - b);
      sortedLinks.forEach((linkNum) => {
        const link = linkMap[linkNum];
        const banner = document.createElement('a');
        banner.href = link.href;
        banner.target = '_blank';
        banner.rel = 'noopener noreferrer';
        banner.className = 'mru-link-ref';
        banner.innerHTML = `🔗 Link #${linkNum} : ${escapeHtml(link.text)}`;

        // Insert banner before the comment body
        commentBody.parentNode.insertBefore(banner, commentBody);
      });
    });
  }

  // Utility to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Watch for dynamically-loaded comments using MutationObserver
  function setupObserver() {
    const commentsContainer = document.querySelector('.comments');
    if (!commentsContainer) return;

    // Initial scan for any comments that are already loaded
    injectBanners();

    // Watch for new comments being added
    const observer = new MutationObserver(() => {
      // Debounce: check once after mutations settle
      clearTimeout(observer.debounceTimer);
      observer.debounceTimer = setTimeout(() => {
        injectBanners();
      }, 100);
    });

    observer.observe(commentsContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupObserver);
  } else {
    setupObserver();
  }
})();
