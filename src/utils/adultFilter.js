const ADULT_CATEGORY_NAMES = new Set([
  'phim 18+',
  '18+',
  'phim 18',
  'adult',
])

const ADULT_CATEGORY_SLUGS = new Set([
  'phim-18',
  '18',
  'adult',
])

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

export function isAdultCategory(category) {
  if (!category) return false

  if (typeof category === 'string') {
    const value = normalize(category)
    return ADULT_CATEGORY_NAMES.has(value) || ADULT_CATEGORY_SLUGS.has(value)
  }

  const name = normalize(category.name)
  const slug = normalize(category.slug)

  return ADULT_CATEGORY_NAMES.has(name) || ADULT_CATEGORY_SLUGS.has(slug)
}

export function isAdultSlug(slug) {
  return ADULT_CATEGORY_SLUGS.has(normalize(slug))
}

export function isAdultMovie(movie) {
  if (!movie) return false

  const categories = [
    ...(Array.isArray(movie.category) ? movie.category : []),
    ...(Array.isArray(movie.categories) ? movie.categories : []),
    movie.category,
  ].filter(Boolean)

  return categories.some(isAdultCategory)
}

export function filterNonAdultMovies(movies = []) {
  return movies.filter(item => !isAdultMovie(item))
}
